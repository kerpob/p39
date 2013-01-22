       window.onload=function(){
            //use AppMobi viewport to handle device resolution differences if you want
            //AppMobi.display.useViewport(768,1024);

            //hide splash screen now that our app is ready to run
            //AppMobi.device.hideSplashScreen();
            
            var canX=50,canY=50,tempx=50,tempy=50,touchtype=0;//1=endturn menu
            var actx=50,acty=50,imscrolling=0,mousedownscroll=0;
            var area=[],unit=[];
	var numareas=0,numunits=146,mp=3,omp=3,player="Player1",suid=-1,turnnumber=1,wid=12,hig=14;
	var supplylength=15;
	var grass = new Image(); var hills = new Image(); var sea = new Image();var trees = new Image();
	var highlite = new Image();
	var border0 = new Image();var border1 = new Image();var border2 = new Image();
	var river0 = new Image();var river1 = new Image();var river2 = new Image();
	grass.src = 'grass1.png'; hills.src = 'hills.png'; sea.src = 'sea.png';
	highlite.src = 'highlite.png'; trees.src="trees.png";
	border0.src = 'border0.png';border1.src = 'border1.png';border2.src = 'border2.png';
	river0.src = 'river0.png';river1.src = 'river1.png';river2.src = 'river2.png';
	var polishinf=new Image();polishinf.src='PolishInfantry.png';
	var germanmech=new Image();germanmech.src='GermanMechanized.png';
	var loaded_images = 0;
            var canvas = document.getElementById("dkcanvas");
            var context = canvas.getContext("2d");
            var canwid=0,canht=0,ucanwid=0,ucanht=0;
            var grasscan,grassctx,mtncan,mtnctx,seacan,seactx,treescan,treesctx;
            var r0can,r0ctx,r1can,r1ctx,r2can,r2ctx,b0can,b0ctx,b1can,b1ctx,b2can,b2ctx;
            //document.body.addEventListener("touchcancel", touchUp, false);
            canvas.addEventListener("touchstart", touchDown, false);
            canvas.addEventListener("touchmove", touchXY, false);
            canvas.addEventListener("touchend", touchUp, false);
            canvas.addEventListener('mousemove', dkmousemove);
            canvas.addEventListener('mouseup', dkmouseup);
            canvas.addEventListener('mousedown', dkmousedown);

 //-------------------------------------------SETUP STUFF------------------------           
// Check to see if all the images have loaded.            
grass.onload = handleLoadedImage; hills.onload = handleLoadedImage; sea.onload = handleLoadedImage;
highlite.onload = handleLoadedImage;trees.onload = handleLoadedImage;
	border0.onload = handleLoadedImage;border1.onload = handleLoadedImage;border2.onload = handleLoadedImage;
	river0.onload = handleLoadedImage;river1.onload = handleLoadedImage;river2.onload = handleLoadedImage;
	polishinf.onload = handleLoadedImage;germanmech.onload = handleLoadedImage;//13
    
    function handleLoadedImage() {// Check to see if all the images have loaded.
    ++loaded_images;
	if (loaded_images == 13) {setup();}
	}
 //--------------------------------------------------------------------------------------------         
        function setup(){
		//setupareas
		setupcanvases();
		var n=0,hi=0,yoffset=0,l0=-1,l1=-1,l2=-1,l3=-1,l4=-1,l5=-1;
		numareas=wid*hig;
		for(w=0;w<wid;w++){
	        	for(h=0;h<hig;h++){
				if(hi==1) yoffset=0; else yoffset = 40*mp;
				area[n]=new areas();
				setupareas(n,w*64*mp,(h*80*mp)+yoffset+100);
				area[n].col=w;area[n].row=h;
				l0=-1,l1=-1,l2=-1,l3=-1,l4=-1,l5=-1;
				if(w!=wid-1){
					l1=n+hig-(hi-1)-1;l2=n+hig-(hi-1);
				}
				if(w!=0){
					l5=n-hig-hi;l4=n-hig-(hi-1);
				}
				if(hi==0&&h==hig-1){l4=-1;l2=-1;}
				if(hi==1&&h==0){l1=-1;l5=-1;}
				if(h>0)l0=n-1;
				if(h<hig-1)l3=n+1;
				area[n].link=[l0,l1,l2,l3,l4,l5];
				area[n].linktype=[0,0,0,0,0,0];
				area[n].uid=[-1,-1,-1,-1,-1];
				n++;
			}
			if (hi==1)hi=0;else hi=1;
		}
		recalibrate(1);
		//terrain
		var hills=[7,22,23,24,36,37,38,51,52,53,67,68,82,83,95,96,110,111,124,125,138,139,151,152,163,166];
		var treesa=[4,5,20,30,49,50,57,58,61,64,65,81,85,114,129,142,143,156];
		var sea=[0,14,84,98];
		var city=[32,35,13,71,90,109,126,132];
		var p1owner=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,20,21,22,23,24,25,26,27,28,29,30,35,36,37,38,39,40,41,42,43,44,49,50,51,52,53,54,55,64,65,67,68,69,71,82,83,84,85,96,97,98,99,100,111,112,113,114,124,125,126,127,128,139,140,141,142,152,153,154,155,156,167];
		var riv0=[19,32,48,61,73,74,76,88,104,117,122,132,133,136,145,147,149,159];
		var riv1=[32,33,59,61,72,74,76,77,78,79,88,89,117,118,133,147,148,159,160];
		var riv2=[18,32,47,58,71,72,76,77,78,88,103,108,117,121,131,135,144,147,148,159];
		for(i=0;i<hills.length;i++)area[hills[i]].terrain=1;
		for(i=0;i<treesa.length;i++)area[treesa[i]].terrain=2;
		for(i=0;i<sea.length;i++)area[sea[i]].terrain=-1;
		for(i=0;i<city.length;i++)area[city[i]].terrain2=1;
		for(i=0;i<p1owner.length;i++)area[p1owner[i]].owner="Player1";
		for(i=0;i<riv0.length;i++){
			area[riv0[i]].linktype[0]=1;
			if(area[riv0[i]].link[0]!=-1)area[riv0[i]-1].linktype[3]=1;
		}
		for(i=0;i<riv1.length;i++){
			area[riv1[i]].linktype[1]=1;
			if(area[riv1[i]].link[1]!=-1)area[area[riv1[i]].link[1]].linktype[4]=1;
		}
		for(i=0;i<riv2.length;i++){
			area[riv2[i]].linktype[2]=1;
			if(area[riv2[i]].link[2]!=-1)area[area[riv2[i]].link[2]].linktype[5]=1;
		}
		area[32].name="Poznan";area[35].name="Breslau";area[13].name="Vienna";area[132].name="Warsaw";
		area[71].name="Danzig";area[90].name="Lodz";area[109].name="Krakow";area[126].name="Konigs.";
		
        //now units:		
		for(i=0;i<numunits;i++){
			unit[i]=new units();
		}
//setupunits(id,aid,"Owner","nation","name","corps","army","armyid","type",str,move,morale,turnarrives,Tanks);
setupunits(0,64,"Player1","German","1 Pz","XVI","10th","10","Tank",3,4,6,0,4);
setupunits(1,64,"Player1","German","4 Pz","XIV","10th","10","Tank",2,4,6,0,4);
setupunits(2,64,"Player1","German","1 Lt","10 Army Res","10th","10","Mechanised",4,4,6,0,1);
setupunits(3,37,"Player1","German","3 Lt","10 Army Res","10th","10","Mechanised",4,4,6,0,1);
setupunits(4,65,"Player1","German","2 Lt","XV","10th","10","Mechanised",4,4,6,0,1);
setupunits(5,51,"Player1","German","13 Mot.","XIV","10th","10","Mechanised",9,4,5,0,0);
setupunits(6,36,"Player1","German","29 Mot.","XIV","10th","10","Mechanised",9,4,5,0,0);
setupunits(7,64,"Player1","German","18","XI","10th","10","Infantry",9,2,5,0,0);
setupunits(8,64,"Player1","German","19","XI","10th","10","Infantry",9,2,5,0,0);
setupunits(9,65,"Player1","German","14","XVI","10th","10","Infantry",9,2,5,0,0);
setupunits(10,51,"Player1","German","31","XVI","10th","10","Infantry",9,2,4,0,0);
setupunits(11,65,"Player1","German","4","IV","10th","10","Infantry",9,2,5,0,0);
setupunits(12,65,"Player1","German","46","IV","10th","10","Infantry",9,2,4,0,0);
setupunits(13,37,"Player1","German","10th HQ","10th HQ","10th","10","HQ",1,1,1,0,0);
setupunits(14,52,"Player1","German","5 Pz","VIII","14th","14","Tank",4,4,6,0,4);
setupunits(15,82,"Player1","German","2 Pz","XVIII","14th","14","Tank",3,4,6,0,4);
setupunits(16,52,"Player1","German","SS Germ.","VIII","14th","14","Mechanised",3,4,5,0,0);
setupunits(17,111,"Player1","German","4 Lt","XVIII","14th","14","Mechanised",4,4,6,0,1);
setupunits(18,124,"Player1","German","1 Mtn","XXII","14th","14","Infantry",9,3,5,3,0);
setupunits(19,124,"Player1","German","2 Mtn","XXII","14th","14","Infantry",9,3,5,0,0);
setupunits(20,52,"Player1","German","8","VIII","14th","14","Infantry",9,2,5,0,0);
setupunits(21,52,"Player1","German","28","VIII","14th","14","Infantry",9,2,5,0,0);
setupunits(22,52,"Player1","German","239","VIII","14th","14","Infantry",9,2,3,0,0);
setupunits(23,67,"Player1","German","7","XVII","14th","14","Infantry",9,2,5,0,0);
setupunits(24,53,"Player1","German","44","XVII","14th","14","Infantry",9,2,4,0,0);
setupunits(25,53,"Player1","German","45","XVII","14th","14","Infantry",9,2,4,0,0);
setupunits(26,111,"Player1","German","3 Mtn","XVIII","14th","14","Infantry",6,3,5,0,0);
setupunits(27,38,"Player1","German","14th HQ","14th HQ","14th","14","HQ",1,1,1,0,0);
setupunits(28,114,"Player1","German","Pz Kempf","I","3rd","3","Tank",4,4,6,0,2);
setupunits(29,113,"Player1","German","217","3 Army Res","3rd","3","Infantry",9,2,3,0,0);
setupunits(30,85,"Player1","German","21","XXI","3rd","3","Infantry",9,2,5,0,0);
setupunits(31,100,"Player1","German","228","XXI","3rd","3","Infantry",9,2,3,0,0);
setupunits(32,114,"Player1","German","11","I","3rd","3","Infantry",9,2,5,0,0);
setupunits(33,114,"Player1","German","61","I","3rd","3","Infantry",9,2,4,0,0);
setupunits(34,128,"Player1","German","1","XXVI","3rd","3","Infantry",9,2,5,0,0);
setupunits(35,128,"Player1","German","12","XXVI","3rd","3","Infantry",9,2,5,0,0);
setupunits(36,126,"Player1","German","3rd HQ","3rd HQ","3rd","3","HQ",1,1,1,0,0);
setupunits(37,142,"Player1","German","1 Cav","3 Army Res","3rd","3","Cavalry",5,3,5,0,0);
setupunits(38,16,"Player1","German","10 Pz","AGN Res","4th","4","Tank",3,4,5,0,3);
setupunits(39,30,"Player1","German","3 Pz","XIX","4th","4","Tank",3,4,6,0,5);
setupunits(40,30,"Player1","German","2 Mot","XIX","4th","4","Mechanised",9,4,5,0,0);
setupunits(41,30,"Player1","German","20 Mot","XIX","4th","4","Mechanised",9,4,5,0,0);
setupunits(42,16,"Player1","German","23","4 Army Res","4th","4","Infantry",9,2,4,0,0);
setupunits(43,15,"Player1","German","218","4 Army Res","4th","4","Infantry",9,2,3,0,0);
setupunits(44,43,"Player1","German","207","4 Army Res","4th","4","Infantry",9,2,3,0,0);
setupunits(45,17,"Player1","German","3","II","4th","4","Infantry",9,2,5,0,0);
setupunits(46,17,"Player1","German","32","II","4th","4","Infantry",9,2,5,0,0);
setupunits(47,17,"Player1","German","50","III","4th","4","Infantry",9,2,4,0,0);
setupunits(48,17,"Player1","German","Netze","III","4th","4","Infantry",3,2,4,0,0);
setupunits(49,16,"Player1","German","4th HQ","4th HQ","4th","4","HQ",1,1,1,0,0);
setupunits(50,50,"Player1","German","SS Leib.","XIII","8th","8","Mechanised",3,4,5,0,0);
setupunits(51,49,"Player1","German","24","X","8th","8","Infantry",9,2,5,0,0);
setupunits(52,49,"Player1","German","30","X","8th","8","Infantry",9,2,5,0,0);
setupunits(53,50,"Player1","German","10","XIII","8th","8","Infantry",9,2,5,0,0);
setupunits(54,50,"Player1","German","17","XIII","8th","8","Infantry",9,2,5,0,0);
setupunits(55,35,"Player1","German","8th HQ","8th HQ","8th","8","HQ",1,1,1,0,0);
setupunits(56,2,"Player1","German","73","AGN Res","AGN GHQ","R","Infantry",9,2,4,0,0);
setupunits(57,71,"Player1","German","Eberhard","AGN Res","AGN GHQ","R","Infantry",6,1,3,0,0);
setupunits(58,3,"Player1","German","208","AGN Res","AGN GHQ","R","Infantry",9,2,3,0,0);
setupunits(59,155,"Player1","German","Lotzen","AGN Res","AGN GHQ","R","Infantry",6,1,3,0,0);
setupunits(60,126,"Player1","German","Konigs.","AGN Res","AGN GHQ","R","Infantry",7,0,3,0,0);
setupunits(61,1,"Player1","German","AGN HQ","AGN HQ","AGN GHQ","R","GHQ",1,0,1,0,0);
setupunits(62,36,"Player1","German","62","AGS Res","AGS GHQ","R","Infantry",9,2,4,0,0);
setupunits(63,35,"Player1","German","213","AGS Res","AGS GHQ","R","Infantry",9,2,3,0,0);
setupunits(64,35,"Player1","German","221","AGS Res","AGS GHQ","R","Infantry",9,2,3,2,0);
setupunits(65,51,"Player1","German","27","VII","AGS GHQ","R","Infantry",9,2,5,0,0);
setupunits(66,51,"Player1","German","68","VII","AGS GHQ","R","Infantry",9,2,4,0,0);
setupunits(67,36,"Player1","German","AGS HQ","AGS HQ","AGS GHQ","R","GHQ",1,0,1,0,0);
setupunits(68,109,"Player2","Poland","10 Mot","Krakow","Krakow","KR","Mechanised",2,4,5,0,0);
setupunits(69,151,"Player2","Poland","2 Mtn","Karpathy","Krakow","KR","Infantry",7,3,5,0,0);
setupunits(70,166,"Player2","Poland","3 Mtn","Karpathy","Krakow","KR","Infantry",11,3,4,0,0);
setupunits(71,81,"Player2","Poland","6","Krakow","Krakow","KR","Infantry",7,2,4,0,0);
setupunits(72,80,"Player2","Poland","7","Krakow","Krakow","KR","Infantry",9,2,4,0,0);
setupunits(73,151,"Player2","Poland","11","Krakow","Krakow","KR","Infantry",9,2,4,0,0);
setupunits(74,80,"Player2","Poland","23","Slask","Krakow","KR","Infantry",9,2,4,0,0);
setupunits(75,109,"Player2","Poland","55 Res","Slask","Krakow","KR","Infantry",9,2,3,2,0);
setupunits(76,66,"Player2","Poland","Katowice","Slask","Krakow","KR","Infantry",6,1,3,0,0);
setupunits(77,81,"Player2","Poland","21 Mtn","Bielsko","Krakow","KR","Infantry",9,3,4,0,0);
setupunits(78,95,"Player2","Poland","1 Mtn","Bielsko","Krakow","KR","Infantry",5,3,5,0,0);
setupunits(79,136,"Player2","Poland","22 Mtn","Tarnow","Krakow","KR","Infantry",9,3,4,0,0);
setupunits(80,137,"Player2","Poland","38 Res","Tarnow","Krakow","KR","Infantry",9,2,3,2,0);
setupunits(81,109,"Player2","Poland","Krakow","Krakow","Krakow","KR","HQ",1,1,1,0,0);
setupunits(82,80,"Player2","Poland","Krakowska","Krakow","Krakow","KR","Cavalry",4,3,4,0,0);
setupunits(83,95,"Player2","Poland","Misiag","Bielsko","Krakow","KR","Cavalry",2,3,4,0,0);
setupunits(84,95,"Player2","Poland","5","Kutno","Lodz","LO","Infantry",9,2,4,0,0);
setupunits(85,89,"Player2","Poland","24","Kutno","Lodz","LO","Infantry",9,2,3,2,0);
setupunits(86,77,"Player2","Poland","2","Lodz","Lodz","LO","Infantry",9,2,4,0,0);
setupunits(87,63,"Player2","Poland","10","Lodz","Lodz","LO","Infantry",11,2,4,0,0);
setupunits(88,79,"Player2","Poland","28","Lodz","Lodz","LO","Infantry",9,2,3,0,0);
setupunits(89,77,"Player2","Poland","Sieradz","Lodz","Lodz","LO","Infantry",4,1,3,0,0);
setupunits(90,79,"Player2","Poland","30","Piotrkow","Lodz","LO","Infantry",9,2,3,0,0);
setupunits(91,90,"Player2","Poland","Lodz","Lodz","Lodz","LO","HQ",1,1,1,0,0);
setupunits(92,89,"Player2","Poland","Kresowa","Lodz","Lodz","LO","Cavalry",3,3,4,0,0);
setupunits(93,78,"Player2","Poland","Wolynska","Piotrkow","Lodz","LO","Cavalry",6,3,4,0,0);
setupunits(94,129,"Player2","Poland","8","Modlin","Modlin","MO","Infantry",8,2,4,0,0);
setupunits(95,115,"Player2","Poland","20","Modlin","Modlin","MO","Infantry",9,2,4,0,0);
setupunits(96,117,"Player2","Poland","Modlin","Modlin","Modlin","MO","Infantry",4,1,3,0,0);
setupunits(97,131,"Player2","Poland","Piltusk","Modlin","Modlin","MO","Infantry",3,1,3,0,0);
setupunits(98,117,"Player2","Poland","Modlin","Modlin","Modlin","MO","HQ",1,1,1,0,0);
setupunits(99,115,"Player2","Poland","Nowogrodska","Modlin","Modlin","MO","Cavalry",6,3,4,0,0);
setupunits(100,129,"Player2","Poland","Mazowiecka","Modlin","Modlin","MO","Cavalry",4,3,4,0,0);
setupunits(101,144,"Player2","Poland","18","Narew","Narew","NA","Infantry",7,2,4,0,0);
setupunits(102,143,"Player2","Poland","33","Narew","Narew","NA","Infantry",9,2,3,0,0);
setupunits(103,157,"Player2","Poland","3 KOP","Narew","Narew","NA","Infantry",3,2,3,99,0);
setupunits(104,159,"Player2","Poland","1","Wyszkow","Narew","NA","Infantry",9,2,4,0,0);
setupunits(105,160,"Player2","Poland","35","Wyszkow","Narew","NA","Infantry",9,2,3,2,0);
setupunits(106,160,"Player2","Poland","41","Wyszkow","Narew","NA","Infantry",6,2,3,2,0);
setupunits(107,158,"Player2","Poland","Narew","Narew","Narew","NA","HQ",1,1,1,0,0);
setupunits(108,157,"Player2","Poland","Podlaska","Narew","Narew","NA","Cavalry",3,3,4,0,0);
setupunits(109,143,"Player2","Poland","Suwalska","Narew","Narew","NA","Cavalry",7,2,4,0,0);
setupunits(110,58,"Player2","Poland","9","Pomorze","Pomorze","PM","Infantry",9,2,4,0,0);
setupunits(111,59,"Player2","Poland","15","Pomorze","Pomorze","PM","Infantry",9,2,4,0,0);
setupunits(112,72,"Player2","Poland","27","Pomorze","Pomorze","PM","Infantry",10,2,3,0,0);
setupunits(113,101,"Player2","Poland","4","Wschod","Pomorze","PM","Infantry",9,2,4,0,0);
setupunits(114,86,"Player2","Poland","16","Wschod","Pomorze","PM","Infantry",9,2,4,0,0);
setupunits(115,58,"Player2","Poland","Pomorska","Czersk","Pomorze","PM","Infantry",6,3,4,0,0);
setupunits(116,73,"Player2","Poland","Pomorze","Pomorze","Pomorze","PM","HQ",1,1,1,0,0);
setupunits(117,33,"Player2","Poland","14","Poznan","Poznan","PZ","Infantry",7,2,4,0,0);
setupunits(118,48,"Player2","Poland","17","Poznan","Poznan","PZ","Infantry",9,2,4,0,0);
setupunits(119,62,"Player2","Poland","25","Poznan","Poznan","PZ","Infantry",11,2,3,0,0);
setupunits(120,31,"Player2","Poland","26","Poznan","Poznan","PZ","Infantry",11,2,3,0,0);
setupunits(121,32,"Player2","Poland","Poznan","Poznan","Poznan","PZ","Infantry",4,1,3,0,0);
setupunits(122,32,"Player2","Poland","Poznan","Poznan","Poznan","PZ","HQ",1,1,1,0,0);
setupunits(123,48,"Player2","Poland","Podolska","Poznan","Poznan","PZ","Cavalry",4,3,4,0,0);
setupunits(124,48,"Player2","Poland","Wielkopulska","Poznan","Poznan","PZ","Cavalry",6,2,4,0,0);
setupunits(125,132,"Player2","Poland","Warszawrea","Lublin","Prusy","PR","Mechanised",2,4,4,0,1);
setupunits(126,162,"Player2","Poland","39","Lublin","Prusy","PR","Infantry",9,2,3,2,0);
setupunits(127,78,"Player2","Poland","13","North","Prusy","PR","Infantry",9,2,4,0,0);
setupunits(128,91,"Player2","Poland","19","North","Prusy","PR","Infantry",9,2,4,0,0);
setupunits(129,91,"Player2","Poland","29","North","Prusy","PR","Infantry",9,2,3,0,0);
setupunits(130,119,"Player2","Poland","44 Res","North","Prusy","PR","Infantry",9,2,3,2,0);
setupunits(131,92,"Player2","Poland","3","South","Prusy","PR","Infantry",9,2,4,0,0);
setupunits(132,134,"Player2","Poland","12","South","Prusy","PR","Infantry",9,2,4,0,0);
setupunits(133,119,"Player2","Poland","36 Res","South","Prusy","PR","Infantry",9,2,3,2,0);
setupunits(134,119,"Player2","Poland","Prusy","Prusy","Prusy","PR","HQ",1,1,1,0,0);
setupunits(135,162,"Player2","Poland","Sandomierz","Lublin","Prusy","PR","Cavalry",5,3,4,2,0);
setupunits(136,91,"Player2","Poland","Wilenska","North","Prusy","PR","Cavalry",3,3,4,0,0);
setupunits(137,157,"Player2","Poland","Grodno","SHQ Res","SHQ","R","Infantry",2,1,3,99,0);
setupunits(138,109,"Player2","Poland","45","SHQ Res","SHQ","R","Infantry",9,2,3,3,0);
setupunits(139,70,"Player2","Poland","Naval","SHQ Res","SHQ","R","Infantry",9,1,3,0,0);
setupunits(140,132,"Player2","Poland","SHQ","SHQ","SHQ","R","GHQ",1,0,1,0,0);
setupunits(141,153,"Player1","Slovakia","Fast","Slovak","Slovak GHQ","SL","Mechanised",2,4,4,0,1);
setupunits(142,139,"Player1","Slovakia","1","Slovak","Slovak GHQ","SL","Infantry",6,2,4,0,0);
setupunits(143,152,"Player1","Slovakia","2","Slovak","Slovak GHQ","SL","Infantry",9,2,3,0,0);
setupunits(144,167,"Player1","Slovakia","3","Slovak","Slovak GHQ","SL","Infantry",6,2,2,0,0);
setupunits(145,139,"Player1","Slovakia","Svk. HQ","Svk. HQ","Slovak GHQ","SL","HQ",1,0,1,0,0);


		for(i=0;i<numunits;i++){//sort uids into areas
			for(j=0;j<5;j++){
				if(area[unit[i].aid].uid[j]==-1){
					area[unit[i].aid].uid[j]=i;
					j=5;
				}
			}
		}//end sort uids into areas
		
		recalibrate(-1);
        }//end setup
            
		function setupareas(id,x,y){
			area[id].id=id;area[id].x=x;area[id].y=y;//area[id].ox=x;area[id].oy=y;
			area[id].selected=0;
		}

        function setupunits(id,aid,owner,nation,uname,corps,army,armyid,type,str,mv,morale,turnarr,tanks){
            unit[id].id=id;unit[id].aid=aid;unit[id].owner=owner;unit[id].corps=corps;unit[id].army=army;
			unit[id].nation=nation;unit[id].uname=uname;unit[id].utype=type;unit[id].morale=morale;
			unit[id].str=str;unit[id].move=mv;unit[id].maxstr=str;unit[id].maxmove=mv;
			unit[id].turnarr=turnarr;unit[id].tanks=tanks;unit[id].armyid=armyid;
			if(turnarr<=0)unit[id].active=1;
			if(unit[id].utype=="HQ"){unit[id].supply=10;unit[id].maxsupply=10;}
			//draw unit
			unit[id].canvas=document.createElement('canvas');
			unit[id].canvas.width=40*mp;
			unit[id].canvas.height=40*mp;
			unit[id].ctx=unit[id].canvas.getContext('2d');
			unit[id].ctx.font=(9*mp)+"px Arial";//fontname;
			unit[id].ctx.fillStyle = 'black';
			if(unit[id].nation=="Slovakia")unit[id].ctx.fillStyle = 'blue';
			if(unit[id].nation=="Poland"){
				unit[id].ctx.drawImage(polishinf, 0,0,unit[id].canvas.width,unit[id].canvas.height);
				}
			if(unit[id].nation=="German"){
				unit[id].ctx.drawImage(germanmech, 0,0,unit[id].canvas.width,unit[id].canvas.height);
				}
			if(unit[id].nation=="Slovakia"){unit[id].ctx.fillRect(0,0,(40*mp),(40*mp));}
			//unit data
			if(unit[id].nation=="Poland"){unit[id].ctx.fillStyle = 'red';}
			else{unit[id].ctx.fillStyle = 'white';}
			unit[id].ctx.fillText(unit[id].uname,(11*mp),(8*mp));
			if(unit[id].utype!="Infantry")unit[id].ctx.fillText(unit[id].utype,(7*mp),(22*mp));
			unit[id].ctx.fillText(unit[id].str,(5*mp),(36*mp));
			if(unit[id].tanks>0)unit[id].ctx.fillText(unit[id].tanks,(15*mp),(36*mp));
			unit[id].ctx.fillText(unit[id].move,(25*mp),(36*mp));
			unit[id].ctx.fillText(unit[id].morale,(1*mp),(24*mp));
			//supply dot if low
			if(unit[id].supply<2){
				unit[id].ctx.beginPath();      
				if(unit[id].supply==1)unit[id].ctx.fillStyle = 'yellow';else unit[id].ctx.fillStyle = 'red';
				unit[id].ctx.arc(36*mp, 19*mp, 3*mp, 0 , 2 * Math.PI, false);
				unit[id].ctx.fill();
				unit[id].ctx.lineWidth = 2;
				unit[id].ctx.strokeStyle = '#003300';
				unit[id].ctx.stroke();
			}
			unit[id].ctx.font=(6*mp)+"px Arial";//fontname;
			unit[id].ctx.fillStyle = 'black';
			unit[id].ctx.fillText(unit[id].armyid,(2*mp),(8*mp));
			if(unit[id].active==0)unit[id].ctx.clearRect(0,0,40*mp,40*mp);//clears screen if inactive
       }//end setupunits
       
       function redrawunit(id){//redraw unit for str etc losses - need omp=original mp.
		   //overwrites canvas
		   unit[id].ctx.clearRect(0,0,40*omp,40*omp);//clears screen
		   if(unit[id].str<1)unit[id].active=0;
		   if(unit[id].active==1){
			unit[id].ctx.font=(9*omp)+"px Arial";//fontname;
			unit[id].ctx.fillStyle = 'black';
			if(unit[id].nation=="Slovakia")unit[id].ctx.fillStyle = 'blue';
			if(unit[id].nation=="Italian")unit[id].ctx.fillStyle = 'yellow';
			if(unit[id].nation=="Poland"){
				unit[id].ctx.drawImage(polishinf, 0,0,unit[id].canvas.width,unit[id].canvas.height);
				}
			if(unit[id].nation=="German"){
				unit[id].ctx.drawImage(germanmech, 0,0,unit[id].canvas.width,unit[id].canvas.height);
				}
			if(unit[id].nation=="Slovakia"){unit[id].ctx.fillRect(0,0,(40*omp),(40*omp));}
			//unit data
			if(unit[id].nation=="Poland"){unit[id].ctx.fillStyle = 'red';}
			else{unit[id].ctx.fillStyle = 'white';}
			unit[id].ctx.fillText(unit[id].uname,(11*omp),(8*omp));
			if(unit[id].utype!="Infantry")unit[id].ctx.fillText(unit[id].utype,(7*omp),(22*omp));
			unit[id].ctx.fillText(unit[id].str,(5*omp),(36*omp));
			if(unit[id].tanks>0)unit[id].ctx.fillText(unit[id].tanks,(15*omp),(36*omp));
			unit[id].ctx.fillText(unit[id].move,(25*omp),(36*omp));
			unit[id].ctx.fillText(unit[id].morale,(1*omp),(24*omp));
			//supply dot if low
			if(unit[id].supply<2){
				unit[id].ctx.beginPath();      
				if(unit[id].supply==1)unit[id].ctx.fillStyle = 'yellow';else unit[id].ctx.fillStyle = 'red';
				unit[id].ctx.arc(36*omp, 19*omp, 3*omp, 0 , 2 * Math.PI, false);
				unit[id].ctx.fill();
				unit[id].ctx.lineWidth = 2;
				unit[id].ctx.strokeStyle = '#003300';
				unit[id].ctx.stroke();
			}
			unit[id].ctx.font=(6*omp)+"px Arial";//fontname;
			unit[id].ctx.fillStyle = 'black';
			unit[id].ctx.fillText(unit[id].armyid,(2*omp),(8*omp));
		}
	   }
 //-----------------------------------------TOUCH STUFF---------------           
            function touchUp(event) {
                event.preventDefault();
                doupstuff();
			}
			
			function dkmouseup(e){
				mousedownscroll=0;
				if(imscrolling!=1)doupstuff();
				imscrolling=0;
			}
			
			function doupstuff(){
				var selectedaid=-1,counter=0;
				if(canY<100&&canX<310){//menu
					if(canX<100)touchtype=1;//endturn();
					if(canX>105&&canX<205&&mp<6){mp=mp*1.1;recalibrate(1.1);}
					if(canX>210&&canX<310&&mp>1){mp=mp*0.9;recalibrate(0.9);}
				}
				else if (touchtype==0){//not menu
					for(i=0;i<numareas;i++){
						if(canX>area[i].x+(16*mp)&&canX<area[i].x+(64*mp)&&canY>area[i].y&&canY<area[i].y+(80*mp)&&imscrolling==0){
							selectedaid=i;
							if(area[i].selected>0){//move unit to selected area
								if(i==unit[suid].aid){rearrangesortorder(i);}//click own unit agin - stack shuffle
								else{
									unit[suid].move-=area[i].movecost;
									redrawunit(suid);
									if(area[i].selected==1){//simple move
										reorganisemover(suid,unit[suid].aid,i);
										unit[suid].aid=i;
										if(unit[suid].move==0)unit[suid].selected=0;
										if(area[unit[suid].aid].owner!=unit[suid].owner){
											area[unit[suid].aid].owner=unit[suid].owner;
										}
									}
									if(area[i].selected==2){//combat
										unit[suid].supply--;
										combat(suid,unit[suid].aid,selectedaid,0,0,0);
										unit[suid].selected=0;
										if(area[unit[suid].aid].owner!=unit[suid].owner){
											area[unit[suid].aid].owner=unit[suid].owner;
										}
										drawareas();
									}
								}//end else
								cleanup(1);
								if(unit[suid].move==0){suid=-1;}
								//else{}
								
							}//end move
							else{ //check for unit to select  
								suid=-1;
								for(j=0;j<5;j++){
									if(area[selectedaid].uid[j]!=-1){
										if(unit[area[selectedaid].uid[j]].active==1&&unit[area[selectedaid].uid[j]].owner==player&&unit[area[selectedaid].uid[j]].move>0){
											suid=area[selectedaid].uid[j];
										}
									}
								}//end for j<5
								cleanup(1);  //deselect areas, then select unit, if any
							}
							i=numareas;
						}//end if area
					}//end for i
					//select areas if unit selected:
					if(suid>-1){
						highlightmoves();
					}
				}//end else not menubar
				if(touchtype>0&&canX>40&&canX<400){//TOUCHTYPE=1 IS A MENU
				/*
				context.fillRect(40,140,360,100);
				context.fillRect(40,260,360,100);
				 */
					if(canY>140&&canY<240){
						endturn();
						touchtype=0;
					}
					if(canY>260&&canY<360){
					touchtype=0;
					}
				}
                recalibrate(-1);
            }//end doupstuff
		
		function rearrangesortorder(xx){
			var higu=-1;var higno=-1;countem=0
			for(h=0;h<5;h++){if(area[xx].uid[h]>-1){higu=area[xx].uid[h];higno=h;countem++}}//get highest uid
			if(higno>0){//reassign orders if higu not in zero pos
				for(h=0;h<higno+1;h++){
					var tempid=area[xx].uid[h];
					area[xx].uid[h]=higu;
					higu=tempid;
				}
			}
			for(h=0;h<5;h++){if(area[xx].uid[h]>-1){suid=area[xx].uid[h];}}//get highest uid for suid
			if(countem<2){cleanup(0);suid=-1;drawareas();}//only 1 unit=deselect all
		}
		
		function setupcanvases(){
			canwid=Math.floor(88*mp);canht=Math.floor(95*mp);
				grasscan = document.createElement('canvas');
				grasscan.width = canwid;
				grasscan.height = canht;
				grassctx = grasscan.getContext('2d');
				grassctx.drawImage(grass, 0,0,grasscan.width,grasscan.height);
				treescan = document.createElement('canvas');
				treescan.width = 88*mp;
				treescan.height = 95*mp;
				treesctx = treescan.getContext('2d');
				treesctx.drawImage(grass, 0,0,treescan.width,treescan.height);
				treesctx.drawImage(trees, 0,0,treescan.width,treescan.height);
				mtncan = document.createElement('canvas');
				mtncan.width = 88*mp;
				mtncan.height = 95*mp;
				mtnctx = mtncan.getContext('2d');
				mtnctx.drawImage(hills, 0,0,mtncan.width,mtncan.height);
				seacan = document.createElement('canvas');
				seacan.width = 88*mp;
				seacan.height = 95*mp;
				seactx = seacan.getContext('2d');
				seactx.drawImage(sea, 0,0,seacan.width,seacan.height);
				r0can = document.createElement('canvas');
				r0can.width = 88*mp;
				r0can.height = 95*mp;
				r0ctx = r0can.getContext('2d');
				r0ctx.drawImage(river0, 0,0,seacan.width,seacan.height);
				r1can = document.createElement('canvas');
				r1can.width = 88*mp;
				r1can.height = 95*mp;
				r1ctx = r1can.getContext('2d');
				r1ctx.drawImage(river1, 0,0,seacan.width,seacan.height);
				r2can = document.createElement('canvas');
				r2can.width = 88*mp;
				r2can.height = 95*mp;
				r2ctx = r2can.getContext('2d');
				r2ctx.drawImage(river2, 0,0,seacan.width,seacan.height);
				b0can = document.createElement('canvas');
				b0can.width = 88*mp;
				b0can.height = 95*mp;
				b0ctx = b0can.getContext('2d');
				b0ctx.drawImage(border0, 0,0,seacan.width,seacan.height);
				b1can = document.createElement('canvas');
				b1can.width = 88*mp;
				b1can.height = 95*mp;
				b1ctx = b1can.getContext('2d');
				b1ctx.drawImage(border1, 0,0,seacan.width,seacan.height);
				b2can = document.createElement('canvas');
				b2can.width = 88*mp;
				b2can.height = 95*mp;
				b2ctx = b2can.getContext('2d');
				b2ctx.drawImage(border2, 0,0,seacan.width,seacan.height);
				
		}
		
		function recalibrate(factor){//-1 indicates a redraw only
			canwid=Math.floor(88*mp);canht=Math.floor(95*mp);
			ucanwid=Math.floor(40*mp);ucanht=Math.floor(40*mp);
			if(factor!=-1){
				for(i=0;i<numareas;i++){
					area[i].x=Math.floor(area[i].x*factor);
					area[i].y=Math.floor(area[i].y*factor);
					area[i].visible=0;
					if(area[i].x+(80*mp)>0&&area[i].y+(80*mp)>0&&area[i].x<1000&&area[i].y<1000)area[i].visible=1;
				}
				/*grasscan = document.createElement('canvas');
				grasscan.width = 88*mp;
				grasscan.height = 95*mp;
				grassctx = grasscan.getContext('2d');
				grassctx.drawImage(grass, 0,0,grasscan.width,grasscan.height);*/
				
				
			}//end factor-1
			//draw map:
			//mapctx.clearRect(0,0,mapcan.width,mapcan.height);//clears screen
			
			 if(factor==-1)drawareas();
		}//end recalibrate---------------------------------------------------------
			
		function selectunit(aid){
			var firstuid=-1,lastuid=-1,doneswap=-1;
			for(j=0;j<numunits;j++){
				if(unit[j].aid==aid&&unit[j].active==1&&unit[j].owner==player&&unit[j].move>0){
					if(firstuid==-1)firstuid=j;
					lastuid=j;
					if(unit[j].selected==0&&doneswap==1){
						unit[j].selected=1;doneswap=2;suid=j;
					}
					if(unit[j].selected==1&&doneswap==-1){
						unit[j].selected=0;doneswap=1;
					}
				}
			}
			if(doneswap<2){unit[firstuid].selected=1;suid=firstuid;}			
		}
		
        function touchDown(event) {
		imscrolling=0;
          event.preventDefault();
            var touch = event.touches[0];
            actx = touch.pageX;
            acty = touch.pageY;
            canX = touch.pageX-canvas.offsetLeft;
            canY = touch.pageY-canvas.offsetTop;
        }
        
        function dkmousedown(e){
			mousedownscroll=1;
			canX = e.layerX - canvas.offsetLeft;
			canY = e.layerY - canvas.offsetTop;
		}

        function touchXY(event) {//scrolly thing
			tempx=canX;
            tempy=canY;
			event.preventDefault();
            var touch = event.touches[0];
            canX = touch.pageX-canvas.offsetLeft;
            canY = touch.pageY-canvas.offsetTop;
            doscroll();
		}
		
		function dkmousemove(e){
			if(mousedownscroll==1){
				tempx=canX;
				tempy=canY;
				canX = e.layerX - canvas.offsetLeft;
				canY = e.layerY - canvas.offsetTop;
				doscroll();
			}
		}
		
		function doscroll(){
			if(canX!=tempx||canY!=tempY){
				imscrolling=1;
				for(i=0;i<numareas;i++){
					area[i].x+=(canX-tempx);
					area[i].y+=(canY-tempy);
					area[i].visible=0;
					if(area[i].x+(80*mp)>0&&area[i].y+(80*mp)>0&&area[i].x<1000&&area[i].y<1000)area[i].visible=1;
				}
				drawareas();
			}
		}
        
        function cleanup(ctype){//0=all, 1=areas, 2=units
			if(ctype==1||ctype==0)for(var i=0;i<numareas;i++)area[i].selected=0;
			if(ctype==2||ctype==0){
				for(var i=0;i<numunits;i++){//sort uids into areas
					unit[i].selected=0;
					if(unit[i].str<1&&unit[i].aid!=-1){
						unit[i].str=0;
						for(var j=0;j<5;j++){if(area[unit[i].aid].uid[j]==i)area[unit[i].aid].uid[j]=-1;}
						unit[i].aid=-1;unit[i].active=0;}
				}//end sort uids into areas
			}
		}
		
		function reorganisemover(uid,afrom,ato){
			var doneorg=0;
			var countem=0;
			
				for(j=0;j<5;j++){
					if(area[afrom].uid[j]==uid){area[afrom].uid[j]=-1;}
				}
				for(j=0;j<5;j++){
					if(area[ato].uid[j]==-1){area[ato].uid[j]=uid;doneorg=1;j=5;}
				}
				if (doneorg==0){
					var linkfr=0;for(l=0;l<6;l++){if(area[afrom].link[l]==ato)linkfr=l;}
					retreat(uid,ato,afrom,linkfr);
				}
		}

function highlightmoves(){//uses suid to see where unit can move to.
	area[unit[suid].aid].selected=1;
	for(i=0;i<6;i++){
		if(area[unit[suid].aid].link[i]!=-1){//valid link area[area[unit[suid].aid].link[i]].selected=1;
			if(movecost(unit[suid].aid,i,area[unit[suid].aid].link[i],suid,0)<=unit[suid].move){
				area[area[unit[suid].aid].link[i]].selected=1;
				if(enemypresent(area[unit[suid].aid].link[i],unit[suid].owner)>0){
					area[area[unit[suid].aid].link[i]].selected=2;
					if(unit[suid].supply<1)area[area[unit[suid].aid].link[i]].selected=0;
				}
			}//end can move
		}//end valid link
	}//end for i
}

function movecost(afrom,linkfrom,ato,uid,mtype){//mtype 0 = move, 1 = supply
	var returner=1;//basic cost =1
	var enemiesinato=0;
	if(area[ato].owner!=unit[uid].owner&&unit[uid].utype=="Infantry")returner++;//cost inf +1 to move to enemy area
	else {if(enemypresent(ato,unit[uid].owner)>0&&unit[uid].tanks==0)returner++;}//costs everyone else +1 to attack, except tanks
	//low supply, mech/tank cost +1 to move
	if(unit[uid].supply<1&&(unit[uid].utype=="Mechanised"||unit[uid].utype=="Tank"))returner++;
	//bad terrain costs:1=hills, 2=forest
	if(area[ato].terrain==1){//hills
		returner++;
		if(unit[uid].utype=="Mechanised"||unit[uid].utype=="Tank"||unit[uid].utype=="HQ"||unit[uid].utype=="GHQ")returner+=2;
	}
	if(area[ato].terrain==2){//forest
		if(unit[uid].utype=="Cavalry")returner++;
		if(unit[uid].utype=="Mechanised"||unit[uid].utype=="Tank"||unit[uid].utype=="HQ"||unit[uid].utype=="GHQ")returner+=2;
	}
	if(area[afrom].linktype[linkfrom]==1){//river
		returner++;
		if(unit[uid].utype=="Mechanised"||unit[uid].utype=="Tank"||unit[uid].utype=="HQ"||unit[uid].utype=="GHQ")returner++;
	}
	//min mv 1 - except HQs or else supplyrecurision gets messed up
	if(unit[uid].move==unit[uid].maxmove&&returner>unit[uid].move&&mtype==0)returner=unit[uid].move;
	//prohibited moves
	//terrain not allowed
	if(area[ato].terrain==-1)returner=9999;//sea
	//overstacking - not for ghq/hq supply
	if(mtype==0&&area[ato].owner==unit[uid].owner){
		var stcntr=0;
		for(var sc=0;sc<5;sc++){if(area[ato].uid[sc]!=-1)stcntr++;}
		if(stcntr==5)returner=9999;
	}
	//tbc
	area[ato].movecost=returner;
	return returner;
}

function enemypresent(atoep,friendowner){//returns 1 if enemy present
	for(var ii=0;ii<numunits;ii++){
		if(unit[ii].active==1&&unit[ii].aid==atoep&&unit[ii].owner!=friendowner)return 1;
	}
	return 0;
}

function enemypresentid(atoepi,friendowner){//returns id of first enemy
	for(var ii=0;ii<numunits;ii++){
		if(unit[ii].active==1&&unit[ii].aid==atoepi&&unit[ii].owner!=friendowner)return ii;
	}
	return 0;
}

function combat(attuid,afrom,ato,attpen,tksus,infsus){
	cleanup(0);
	var linkfr=0;for(var l=0;l<6;l++){if(area[afrom].link[l]==ato)linkfr=l;}//id of link from - helps retreat/terrain mods
	//var d6=Math.floor((Math.random()*6)+1);
	var attret=0,defret=0,defuid=-1;
	for(var ci=0;ci<5;ci++){if(area[ato].uid[ci]!=-1)defuid=area[ato].uid[ci];}//top defender
	//tbc - terrain mods
	//HQ autoretreat
	if(unit[defuid].utype=="HQ"){defret=1;}
	//tank fights
	if(defret==0){if(unit[defuid].tanks>0){if(combatret(attuid,unit[defuid].tanks,10,20)==1){attret=1;}}}
	if(defret+attret==0&&unit[attuid].tanks-tksus>0){if(combatret(defuid,unit[attuid].tanks-tksus,20,80)==1){defret=1;}}
	if(attret+defret==0){if(combatret(attuid,unit[defuid].str,5,20)==1){attret=1;}}
	if(attret+defret==0){if(combatret(defuid,unit[attuid].str,5,20)==1){defret=1;}}
	if(attret+defret==2){defret=0;attret=0;}//anomoly
	if(unit[defuid].str<1){unit[defuid].str=0;deadcheck(defuid);defret=1;attret=0;}//defender wiped out
	if(unit[attuid].str<1){unit[attuid].str=0;deadcheck(attuid);attret=1;defret=0;}//attacker wiped out
	if(attret==1||attret+defret==0){
		unit[attuid].move=0;
	}
	redrawunit(attuid);redrawunit(defuid);
	if(defret==1){
		var continuecombatcheck=0;
		if(unit[defuid].str>0){//defender not wiped out retreats
			retreat(defuid,ato,afrom,linkfr);
			unit[defuid].supply--;
			if(unit[defuid].supply<0){
				unit[defuid].supply=0;
				unit[defuid].str--;
				if(unit[defuid].str<1){unit[defuid].str=0;deadcheck(defuid);}
				}
		redrawunit(defuid);
		}
		for(var ci=0;ci<5;ci++){if(area[ato].uid[ci]!=-1)continuecombatcheck=1;}
		if(continuecombatcheck==1){
			if(unit[attuid].tanks<tksus)tksus++;//lose a tank
			combat(attuid,afrom,ato,attpen,tksus,infsus);
			}
		else{
			reorganisemover(attuid,unit[attuid].aid,ato);
			unit[attuid].aid=ato;
			//unit[attuid].selected=0;
			cleanup(0);
		}
	}
}//end combat

function combatret(cuid,hitno,hitchancevtk,hitchancevinf){//allocates losses
	var infhits=0,tkhits=0,returner=0;
	for(var ci=0;ci<hitno;ci++){
		if(Math.floor((Math.random()*100))<hitchancevtk){
			unit[cuid].tanks--;
			if(unit[cuid].tanks<0)unit[cuid].tanks=0;
		}
	}
	for(var ci=0;ci<hitno;ci++){
		if(Math.floor((Math.random()*100))<hitchancevinf){
			unit[cuid].str--;
			infhits++;
			//if(unit[cuid].str<0){unit[cuid].str=0;deadcheck(cuid);}
		}
	}
	if(infhits>0){if(moralecheck(cuid,infhits,"")==1)returner=1;}
	return returner;
}

function moralecheck(muid,mhits,mhittype){//checks if morale lost
	var returner=0;
	var mchance=5*(7-unit[muid].morale);
	if(mhittype=="tank"&&unit(muid).tanks==0)mchance=10*(7-unit[muid].morale);
	for(var m=0;m<mhits;m++){
		if(Math.floor((Math.random()*100))<mchance){//fail
			returner=1;
			unit[muid].morale--;
			if(unit[muid].morale<0)unit[muid].morale=0;
		}
	}
	return returner;
}

function retreat(ruid,ato,afrom,linkfr){
	var retto=linkfr-3;if(linkfr<0)linkfr+=6;
	var retdone=retreatcheck(ruid,ato,afrom,linkfr);
	if(retdone==0){//cannot retreat that way - try this
		linkfr-=1;if(linkfr<0)linkfr+=6;
		retdone=retreatcheck(ruid,ato,afrom,linkfr);
	}
	if(retdone==0){//cannot retreat that way - try this
		linkfr+=2;if(linkfr>5)linkfr-=6;
		retdone=retreatcheck(ruid,ato,afrom,linkfr);
	}
	if(retdone==0){//cannot retreat that way - try this
		linkfr-=3;if(linkfr<0)linkfr+=6;
		retdone=retreatcheck(ruid,ato,afrom,linkfr);
	}
	if(retdone==0){//cannot retreat that way - try this
		linkfr+=4;if(linkfr>5)linkfr-=6;
		retdone=retreatcheck(ruid,ato,afrom,linkfr);
	}
	if(retdone==0){//cannot retreat
		unit[ruid].str=0;
		deadcheck(ruid);
		//cleanup(0);
	}
}

function retreatcheck(ruid,ato,afrom,linkfr){
	var returner=0;
	if(area[ato].link[linkfr]!=-1){//valid link
		if(enemypresent(area[ato].link[linkfr],unit[ruid].owner)==0&&area[area[ato].link[linkfr]].terrain!=-1){
			returner=1;
			retreatmove(ruid,ato,area[ato].link[linkfr]);
		}
	}
	return returner;
}

function retreatmove(ruid,rafrom,rato){
	unit[ruid].aid=rato;
	if(unit[ruid].str>0)area[rato].owner=unit[ruid].owner;
	reorganisemover(ruid,rafrom,rato)
	//use check of rafrom to rato terrain to see if additional losses, e.g. tanks
}

function deadcheck(duid){
	if(unit[duid].str<1){
		unit[duid].tanks=0;
		unit[duid].active=0;
		//for(var j=0;j<5;j++){if(area[unit[duid].aid].uid[j]==duid)area[unit[duid].aid].uid[j]=-1;}
		//unit[duid].aid=-1
		cleanup(2);
		redrawunit(duid);
	}
}

//----------------------------supply--------------------------------
function checksupply(splayer){
	for(var ii=0;ii<numareas;ii++)area[ii].supmv=9999;
	for(var i=0;i<numunits;i++){
		if(unit[i].active==1&&unit[i].utype=="GHQ"&&unit[i].owner==splayer){
			area[unit[i].aid].supmv=0;
			for(var j=0;j<6;j++){
				if(area[unit[i].aid].link[j]!=-1){
					if(area[area[unit[i].aid].link[j]].owner==splayer){
						supplyrecurse(i,unit[i].aid,area[unit[i].aid].link[j],j,splayer,"GHQ",0);
					}
				}
			}
		}
	}
	//increase supply of HQs to max
	for(var i=0;i<numunits;i++){
		if(unit[i].active==1&&unit[i].utype=="HQ"&&unit[i].owner==splayer){
			if(area[unit[i].aid].supmv<9999)unit[i].supply+=2;
			if(area[unit[i].aid].supmv<15)unit[i].supply+=2;
			if(area[unit[i].aid].supmv<10)unit[i].supply+=2;
			if(area[unit[i].aid].supmv<5)unit[i].supply+=2;
			if(unit[i].supply>unit[i].maxsupply)unit[i].supply=unit[i].maxsupply;
			redrawunit(i);
		}
	}
	//each HQ supplys it's own units:
	for(var i=0;i<numunits;i++){
		if(unit[i].active==1&&unit[i].utype=="HQ"&&unit[i].owner==splayer){
			for(var ii=0;ii<numareas;ii++)area[ii].supmv=9999;
			area[unit[i].aid].supmv=0;
			for(var j=0;j<6;j++){
				if(area[unit[i].aid].link[j]!=-1){
					if(area[area[unit[i].aid].link[j]].owner==splayer){
						supplyrecurse(i,unit[i].aid,area[unit[i].aid].link[j],j,splayer,"HQ",0);
					}
				}
			}
			for(var k=0;k<numunits;k++){
				if(unit[k].active==1&&unit[k].utype!="HQ"&&unit[k].owner==splayer&&unit[k].army==unit[i].army&&unit[k].supply<2&&area[unit[k].aid].supmv<=supplylength&&unit[i].supply>0){//supply range of supplylength
					unit[k].supply++;
					unit[i].supply--;
					redrawunit(k);
				}
			}
			redrawunit(i);
		}//end if unit=HQ
	}
	
}

function supplyrecurse(sid, afrom, ato, linkfrom, splayer, stype, smvsofar){
	if(smvsofar+movecost(afrom,linkfrom,ato,sid,0)<area[ato].supmv){
		area[ato].supmv=smvsofar+movecost(afrom,linkfrom,ato,sid,0);
		for(var k=0;k<6;k++){
			if(area[ato].link[k]!=-1&&area[ato].link[k]!=afrom&&(stype!="HQ"||area[ato].supmv<supplylength)){
				if(area[area[ato].link[k]].owner==splayer){
					supplyrecurse(sid,ato,area[ato].link[k],k,splayer,stype,area[ato].supmv);
				}
			}
		}
	}
}

//--------------------------------END TURN-------------------------------------
function endturn(){
	if(player=="Player1")player="Player2"; else {player="Player1";turnnumber++;}
	checksupply(player);
	for(i=0;i<numunits;i++){
		if(unit[i].move<unit[i].maxmove&&unit[i].active==1){
			unit[i].move=unit[i].maxmove;
			redrawunit(i);
		}
	}
	cleanup(0);
	drawareas();
}

//----------------------------------DRAW STUFF------------------------------------------        
            
function drawareas(){
	context.clearRect(0,0,1000,1000);//clears screen
	//context.save();
		//DRAW AREAS
		//context.drawImage(mapcan,mapx,mapy);
				
		//DRAW AREAS
			for(i=0;i<numareas;i++){
				if(area[i].visible==1){
					if(area[i].terrain==0)context.drawImage(grasscan, area[i].x,area[i].y,canwid,canht);
					if(area[i].terrain==1)context.drawImage(mtncan, area[i].x,area[i].y,canwid,canht);
					if(area[i].terrain==2)context.drawImage(treescan, area[i].x,area[i].y,canwid,canht);
					if(area[i].terrain==-1)context.drawImage(seacan, area[i].x,area[i].y,canwid,canht);
					if(area[i].selected>0)context.drawImage(highlite, area[i].x,area[i].y,canwid,canht);
					context.fillStyle = 'blue';
					context.font=(10*mp)+"px Arial";
					if(area[i].name!="")context.fillText(area[i].name,area[i].x+(17*mp),area[i].y+(16*mp));
					//this a test
					//context.fillText(area[i].supmv,area[i].x+(47*mp),area[i].y+(80*mp));
					//
					if(area[i].terrain2==1){//city
						context.fillStyle = 'black';
						context.fillRect(area[i].x+(20*mp),area[i].y+(20*mp),30*mp,20*mp);
					}
				}
			}//end for i
			//draw borders (and units)
			var offxy=0;var stackcount=0;
			for(i=0;i<numareas;i++){
				if(area[i].visible==1){
				 area[i].ucount=0;
				 for(j=0;j<3;j++){
					 if(area[i].link[j]!=-1){
						 if(area[i].linktype[j]==1){
							 if(j==0)context.drawImage(r0can, area[i].x,area[i].y,canwid,canht);
							 if(j==1)context.drawImage(r1can, area[i].x,area[i].y,canwid,canht);
							 if(j==2)context.drawImage(r2can, area[i].x,area[i].y,canwid,canht);
						 }
						 if(area[i].owner!=area[area[i].link[j]].owner){
							 if(j==0)context.drawImage(b0can, area[i].x,area[i].y,canwid,canht);
							 if(j==1)context.drawImage(b1can, area[i].x,area[i].y,canwid,canht);
							 if(j==2)context.drawImage(b2can, area[i].x,area[i].y,canwid,canht);
						 }
					 }//end link
				 }//end j border
				 //draw units
				 stackcount=0;
					for(j=0;j<5;j++){
						if(area[i].uid[j]>-1){
							if(unit[area[i].uid[j]].active==1&&unit[area[i].uid[j]].visible==1){//only draw if visible
								stackcount++;
								offxy=(stackcount)*10*mp;
								context.drawImage(unit[area[i].uid[j]].canvas, area[i].x+offxy,area[i].y+offxy,ucanwid,ucanht);
								
							}//end if unit visible
						}//end if j !=-1
					}//end j draw units
				}//end if visible
			 }//end i
	
	//DRAW MENUBOXES etc
	context.fillStyle = 'black';
	context.fillRect(0,0,100,100);//menu
	context.fillRect(105,0,100,100);//+
	context.fillRect(210,0,100,100);//-
	context.fillRect(315,0,100,50);//info
	context.fillStyle = 'white';
	context.font="35px Arial";
	context.fillText("Menu",5,40);
	context.fillText("+",150,60);
	context.fillText("-",255,60);
	context.font="15px Arial";
	context.fillText(player,5,60);
	context.fillText("Turn "+turnnumber,5,80);
	if(suid!=-1)context.fillText(unit[suid].uname,320,25);
	
	if(touchtype>0){//menubox
		var tbht=260;//num items * 120 +20
		context.fillStyle = 'black';
		context.fillRect(20,120,400,tbht);//menu
		context.fillStyle = 'white';
		context.fillRect(40,140,360,100);
		context.fillRect(40,260,360,100);
		context.fillStyle = 'black';
		context.font="35px Arial";
		if(touchtype==1){
			context.fillText("Confirm End Turn",60,200);
			context.fillText("Cancel",60,320);
		}
	}
	
	
	
	//context.restore();
}//end drawareas


        
//-----------------------------------------------------------------------------
/////////////////////////////CLASSES DOWN HERE:
//////////////////////////areas
function areas() {
	this.id=0;
	this.x = 0;
	this.y = 0;
	//this.ox = 0;
	//this.oy = 0;
	this.col = 0;
	this.row = 0;
	this.selected = 0;
	this.terrain=0;
	this.terrain2=0;
	this.link=[];
	this.linktype=[];
	this.name="";
	this.owner="Player2";
	this.ucount=0;
	this.visible=1;
	this.movecost=0;
	this.uid=[];
	this.supmv=0;//supply movecosts
}
///////////////////////////////////////units
//function setupunits(id,aid,owner,nation,uname,corps,army,armyid,type,str,mv,morale,turnarr,tanks)
function units(){
	this.id=0;
	this.aid=0;
	this.owner="Player1";
	this.nation="German";
	this.utype="Infantry";
	this.corps="Res";
	this.army="Res Army";
	this.armyid="R";
	this.str=0;
	this.maxstr=0;
	this.move=0;
	this.maxmove=0;
	this.uname="1";
	this.active=1;
	this.selected=0;
	this.visible=1;
	this.supply=2;
	this.supplymax=2;//max supply = bigger for HQ, infinite for GHQ
	this.tanks=0;
	this.turnarr=0;
	this.morale=0;
	this.canvas;
	this.ctx;
	/*grasscan = document.createElement('canvas');
				grasscan.width = 88*mp;
				grasscan.height = 95*mp;
				grassctx = grasscan.getContext('2d');
				grassctx.drawImage(grass, 0,0,grasscan.width,grasscan.height);*/
}


}//end of ondeviceready

        //initial event handler to detect when appMobi is ready to roll
        //document.addEventListener("appMobi.device.ready",onDeviceReady,false);
        
        
