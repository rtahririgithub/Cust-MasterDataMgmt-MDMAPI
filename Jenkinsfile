import jenkins.model.Jenkins
import hudson.FilePath
@Library ('infra-paas-starter-lib@v5.0.2')
import com.telus.paas.starter.*
import com.telus.paas.starter.util.*
import com.telus.paas.starter.stage.*

def buildTemplate = new defaultBuildPodTemplate()
def checkoutStage = new Checkout()
def buildUnitTestStage = new BuildUnitTest()
def staticCodeAnalysisStage = new StaticCodeAnalysis()
def createImageStage = new CreateImage()
def deployStage = new Deploy()
def prompt = new Prompt()
def integrationTestStage = new IntegrationTest()
def crqStage = new CreateCrq()

buildTemplate {
  //Notification, recpeientList needs to be outside of try block for use in catch
  def recipientList
  def tag
  def selectedEnvironment
  def gitUrl=scm.getUserRemoteConfigs()[0].getUrl()
  def environment

  echo "GitURL: ${gitUrl}"

  try {
    // Variables
    environment=''
    tag = ''
    starterKit = 'node'
    currentBuild.result = 'SUCCESS'
    node('buildpod') {
      stage('Checkout') {
        checkoutStage.doCheckout()
        recipientList=checkoutStage.recipientList
        tag=checkoutStage.generatedName
      }
      //Build/Scan Unit Test Stage
      stage('Build-UnitTest') {
        buildUnitTestStage.doBuildUnitTest(tag, starterKit)
      }
      //Launch static code analysis
      stage('Static Code Analysis') {
        //Static code analysis disabled via ENABLE_STATIC_CODE_ANALYSIS in build-template.yaml
        staticCodeAnalysisStage.executeStaticCodeAnalysis(gitUrl)
      }
      //Create the image
      stage('Create Image') {
        createImageStage.doCreateImage(tag,starterKit)
      }
      //Deploy to DV
      stage('Deploying to Dev') {
        deployStage.deployDV(tag, recipientList, gitUrl, starterKit)
      }
      //Check static code analysis results
      stage ('Check Scan Results') {
        //Static code analysis disabled via ENABLE_STATIC_CODE_ANALYSIS in build-template.yaml
        staticCodeAnalysisStage.reviewStaticCodeAnalysis()
      }
    }
    // Deploy to PT ?
    stage ('Deploy to PT?') {
      environment=prompt.deployPTPrompt(recipientList)
    }
    node('buildpod')
    {
      stage('Deploying to PT') {
        deployStage.deployPT(tag, recipientList, environment, starterKit)
      }
      //stage('Integration Test') {
        //integrationTestStage.doIntegrationTest(environment, starterKit)
      //}
    }
    //Deploy to ST
    stage ('Deploy to ST?') {
      environment=prompt.deploySTPrompt(recipientList)
    }

    //Determine if environment it04 selected
    if (environment.equals("it04"))
    {
      node ('buildpod') {
        stage('Deploying to Staging'){
          deployStage.deployST(tag, recipientList, environment, starterKit)
        }
      }
    } 
    
    //create CRQ
    node {
      try {     // allow pipeline to continue if stage fails
        stage('create CRQ?') {
          crqRequest = prompt.crqPrompt(recipientList)
          crqResponse = crqStage.createCrq(crqRequest, recipientList)
        }
      } catch (err) {
        echo(err.toString())
      }
    } 
  }
  catch (err) {
    echo ("Attempting to send errorMessage to ${recipientList}")
    def notificationUtil=new NotificationUtil()
    notificationUtil.sendErrorMessage(recipientList)
    currentBuild.result = 'FAILURE'
    throw err
  }
}
