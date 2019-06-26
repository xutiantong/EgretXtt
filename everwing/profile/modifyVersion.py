#coding=utf-8
import sys
import os
import datetime

def main():   

    #test code
    # do_modifyDataTableVersion("3.44.55","19")
    # return


    showVersion = sys.argv[1].strip()

    # before modify
    do_beforeModify()
    

    #android showVersion
    do_showVersion(showVersion)


    #do_afterModify()

    #commit
    do_gitCommit(showVersion)
    



def do_showVersion(logicVersion):
    androidLogicFile = './assets/Script/Game/JsConfigs.js'
    insertText="    Game_Version: \"%s\" //AnchoredByScript, not del this comment" %(logicVersion)
    do_Version(androidLogicFile,logicVersion,insertText)

  

    
def do_Version(androidLogicFile,logicVersion,insertText):
    #find linenumber 
    cmdStr = 'grep -n "AnchoredByScript" %s' %(androidLogicFile)
    retStr = os.popen(cmdStr).readlines()
    lineNumber = ""
    for line in retStr:
        idx = line.find(":")
        lineNumber = line[0:idx]
    #print "lineNumber:" ,lineNumber   

    #insert one line
    anchorText="AnchoredByScript"
    cmdStr = "sed -i  '/%s/a %s' %s" %(anchorText,insertText,androidLogicFile)
    #print cmdStr
    retStr = os.popen(cmdStr).readlines()
    #print "retStr:",retStr
   
    #del first line
    cmdStr = "sed -i -e '%sd' %s" %(lineNumber,androidLogicFile)
    retStr = os.popen(cmdStr).readlines()


      
def do_beforeModify():
    # git pull
    cmdStr = "git pull"
    retStr = os.popen(cmdStr).readlines()

def do_afterModify():
    cmdStr = 'find . -name "*.sedbak" | xargs rm -rf'
    retStr = os.popen(cmdStr).readlines()

def do_gitCommit(showVersion):
    # git commit
    cmdStr = 'git commit -am "[Auto] modify version: %s" ' %(showVersion)
    #print cmdStr
    retStr = os.popen(cmdStr).readlines()
    print retStr
    # # git pull
    # cmdStr = "git pull"
    # retStr = os.popen(cmdStr).readlines()
    # # git push
    # cmdStr = "git push"
    # retStr = os.popen(cmdStr).readlines()
    
if __name__ == '__main__':
    main()