#!/usr/bin/env python
#-*- coding: utf-8 -*-

import sys, os, shutil

def main(project_path, build_path):
    files = os.listdir(build_path)
    for line in files:
        filepath = os.path.join(build_path, line)
        if os.path.isdir(filepath):
            continue
        if line.find('splash.') >= 0 and line.find('.png') > 0:
            print('>> replace splash.png')
            src = os.path.join(project_path, 'assets/resources/loading/loading_logo1.png')#.replace('\\','/')
            if os.path.exists(src):
                print('>> splash path'+src)
                shutil.copy(src, filepath)
            else:
                src = os.path.join(project_path, 'assets/resources/loading/loading_logo1.jpg')#.replace('\\','/')
                print('>> splash path '+src)
                shutil.copy(src, filepath)
        elif line == 'index.html':
            for x in files:
                if x.find('launch.') >= 0 and x.find('.js') > 0:
                    with open(filepath, 'r') as index_html:
                        old_content = '<script src="main.'
                        new_content = '<script src="' + x + '" charset="utf-8"></script>\n' + old_content
                        old_progress_content='<div class="progress-bar stripes"'
                        new_progress_content='<div class="progress-bar stripes" style="display:none"'
                        content = index_html.read().replace(old_content, new_content).replace(old_progress_content,new_progress_content)
                        with open(filepath, 'w') as index_html_new:
                            index_html_new.write(content)
                            print('>> replace index.html')
                    break
        elif line.find('style-mobile')>=0 and line.find('.css')>0:
            print('开始替换 style-mobile')
            with open(filepath,'r') as mobileStyle:
                old_content='#171717'
                new_content='#ffffff'
                content = mobileStyle.read().replace(old_content, new_content)
                with open(filepath, 'w') as mobileStyle_new:
                    mobileStyle_new.write(content)
                    print('>> replace style-mobile.css color')
        elif line.find('main')>=0 and line.find('.js')>0:
            print('开始替换 main js')
            with open(filepath,'r') as mainJs:
                old_content='progressBar.style.width = \'0%\';'
                new_content='//progressBar.style.width = \'0%\';'
                content = mainJs.read().replace(old_content, new_content)
                with open(filepath, 'w') as mainJs_new:
                    mainJs_new.write(content)
                    print('>> replace main.js progressBar')
    pass

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
