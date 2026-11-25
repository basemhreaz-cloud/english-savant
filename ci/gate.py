import subprocess as S,time,pathlib,xml.etree.ElementTree as ET,re,json,os,traceback
out=pathlib.Path('gate-evidence');out.mkdir(exist_ok=True);results=[];counter=0
pkg='eg.englishsavant.app'
def adb(*a,check=True):return S.run(['adb',*a],capture_output=True,check=check).stdout.decode(errors='replace')
def shot(name):
 global counter
 counter+=1;p=out/f'gate-{counter:03d}-{name}.png';p.write_bytes(S.check_output(['adb','exec-out','screencap','-p']));return p

def nodes():
 adb('shell','uiautomator','dump','/sdcard/gate.xml',check=False)
 b=adb('exec-out','cat','/sdcard/gate.xml');(out/'last-ui.xml').write_text(b)
 return list(ET.fromstring(b).iter('node'))
def text(n):return ' '.join([n.get('text',''),n.get('content-desc',''),n.get('resource-id','')]).strip()
def tap(pred,label,scroll=0):
 for i in range(scroll+1):
  ns=nodes();matches=[n for n in ns if pred(n) and n.get('enabled')=='true']
  for n in matches:
   nums=list(map(int,re.findall(r'\d+',n.get('bounds',''))))
   if len(nums)==4 and nums[2]>nums[0] and nums[3]>nums[1]:
    shot('before-'+label);adb('shell','input','tap',str((nums[0]+nums[2])//2),str((nums[1]+nums[3])//2));time.sleep(2);shot(label);return text(n)
  if i<scroll:
   size=adb('shell','wm','size');w,h=map(int,re.findall(r'(\d+)x(\d+)',size)[-1]);adb('shell','input','swipe',str(w//2),str(h*4//5),str(w//2),str(h//3),'400');time.sleep(1)
 raise RuntimeError('Visible target absent: '+label)
def match(*terms):return lambda n:any(t.lower() in text(n).lower() for t in terms)
def home():
 adb('shell','am','force-stop',pkg);adb('shell','monkey','-p',pkg,'-c','android.intent.category.LAUNCHER','1');time.sleep(5)
def test(name,fn):
 try:r=fn();results.append({'check':name,'automation':'completed','detail':r})
 except Exception as e:results.append({'check':name,'automation':'blocked','detail':str(e)});shot('blocked-'+name);(out/(name+'-trace.txt')).write_text(traceback.format_exc())
 (out/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
def airplane(on):
 api=int(os.environ['API'])
 if api>=30:adb('shell','cmd','connectivity','airplane-mode','enable' if on else 'disable',check=False)
 else:
  adb('shell','settings','put','global','airplane_mode_on','1' if on else '0');adb('shell','am','broadcast','-a','android.intent.action.AIRPLANE_MODE','--ez','state','true' if on else 'false',check=False)
 adb('shell','svc','wifi','disable' if on else 'enable',check=False);adb('shell','svc','data','disable' if on else 'enable',check=False)
 (out/f'airplane-{on}.txt').write_text(adb('shell','settings','get','global','airplane_mode_on'))
def menu():return tap(match('القائمة','Open menu','Menu','فتح القائمة'),'menu')
def search():
 home();menu()
 try:tap(match('بحث','Search'),'search-open')
 except Exception:
  adb('shell','input','keyevent','4');tap(match('بحث','Search'),'search-open')
 tap(lambda n:n.get('class')=='android.widget.EditText','search-field');adb('shell','input','text','unit');adb('shell','input','keyevent','4');time.sleep(3);shot('search-unit');nodes();(out/'search-ui.xml').write_text(adb('exec-out','cat','/sdcard/gate.xml'));return 'Typed unit; visual overlap review required'
def library():
 home();menu();tap(match('المكتبة','Library','مذكرات','Booklets'),'library',scroll=5)
def pdf(lang):
 library()
 if lang=='en':
  tap(match('English','اللغة','Language'),'language')
 tap(match('sample-g1','تحميل','عرض','Download','Open','Preview'),'pdf-open',scroll=7);time.sleep(5);shot('pdf-page1-'+lang)
 label=tap(lambda n:text(n).strip() in ['التالي','Next'],'pdf-next-'+lang);time.sleep(3);shot('pdf-page2-'+lang);(out/('pdf-ui-'+lang+'.xml')).write_text(adb('exec-out','cat','/sdcard/gate.xml'));return {'next_label':label,'page2':'visual verification required'}
def player():
 home();menu();tap(match('الفيديوهات','Videos','فيديو'),'video-list',scroll=5);tap(match('شرح','Unit','الوحدة'),'unit-player',scroll=7);time.sleep(5);shot('offline-player');return 'Opened offline player; availability/playback must be reviewed'
def fonts():
 for scale in ['0.85','1.3','2.0']:
  adb('shell','settings','put','system','font_scale',scale);home();shot('font-'+scale+'-home')
  try:
   menu();tap(match('المرحلة الابتدائية','Primary'),'primary',scroll=5);tap(match('الأول الابتدائي','Primary 1'),'grade1',scroll=6);tap(match('الوحدة','Unit'),'lesson',scroll=6);shot('font-'+scale+'-lesson')
  except Exception as e:results.append({'check':'font-'+scale+'-lesson','automation':'blocked','detail':str(e)})
 return 'Home and available lesson captures; visual clipping review required'
try:
 install=adb('install','-r','ci/app2114.apk');(out/'install.txt').write_text(install);assert 'Success' in install
 info=adb('shell','dumpsys','package',pkg);(out/'package.txt').write_text(info);assert 'versionCode=39' in info and 'versionName=2.1.14-offline' in info
 adb('logcat','-c');home();time.sleep(5);shot('cold-launch');crash=adb('logcat','-d','-s','AndroidRuntime:E');(out/'AndroidRuntime.txt').write_text(crash);assert 'FATAL EXCEPTION' not in crash
 results.append({'check':'install-and-cold-launch','automation':'completed','detail':'Exact APK, versionCode39/versionName2.1.14-offline, see crash log'})
 test('menu-search',search)
 airplane(True);shot('airplane-on')
 test('offline-player',player)
 test('pdf-ar',lambda:pdf('ar'))
 test('pdf-en',lambda:pdf('en'))
 test('font-scales',fonts)
 test('offline-relaunch',lambda:(home(),shot('offline-relaunch'),'Visual full-home verification required')[-1])
except Exception as e:
 results.append({'check':'setup','automation':'blocked','detail':str(e)});shot('setup-error');(out/'fatal.txt').write_text(traceback.format_exc())
finally:
 adb('shell','settings','put','system','font_scale','1.0',check=False);airplane(False)
 (out/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));print(json.dumps(results,ensure_ascii=False));print('AUTOMATION IS NOT A VISUAL PASS. Review every PNG.')
