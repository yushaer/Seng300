// resize motor tag 
   


    function disp(bt,event){
      var test =bt.childNodes[3];
       
       console.log(bt.childNodes[3])
     
            event.stopPropagation();
            $(test).show();
             $(test).on("click", function (event) {
                 event.stopPropagation();
    });

    
    }
    
    function generate_options(code){
        var sel = document.getElementById("Cable-Length");
        var len= sel.options.length;
        
        var feet=["","20","50","100","200"]
       
            for(var i =0; i<len;i++){

            if(sel.options[i].value!="select"){
                var val;
                if(code == "CEC"){
                      val =String(parseInt(sel.options[i].value)*3.28);
                      sel.options[i].value=val;
                    sel.options[i].text=val;
                }
                else{
                    if( document.getElementById('outputc1').innerHTML=="CEC"){
                        val=String(Math.round(parseInt(sel.options[i].value)/3.28));
                        sel.options[i].value=val;
                        sel.options[i].text=val;
                    }
                }
               


            }
        
           

        }
    }
    $(document).ready(function() {
    
       // generate_info("notes/Efficiency.html");
        //generate_info("notes/notes2.html")
        
      
        start();
        
});
function start(){
    var sel = document.getElementById("Cable-Length");
        for(var i = 20; i<1000;i+=25){
            var option= document.createElement('option');
            option.value=String(i);
            option.text=String(i);
            sel.add(option);
        }
        generate_options("NEC");
   
}
function generate_info(name){
  
       
        var id="info";
        if(name=="notes/notes2.html"){
            id="info2"
        }
        console.log(name);
        var file = name;
         $.ajax({
        type:"POST",
        url: 'files.php',
        data:{Name:file},
        success:function(data) { 

                var info=document.getElementById(id);
                var receiveDate = (new Date()).getTime();
                console.log(id)
               
                 //alert("server response time " + responseTimeMs);
                info.innerHTML+=data;
    
              
     
              
            }
      
    });

    
}
function calculate_amps(Kw, V){
    var x =Kw/V;
    return round(1000* x);
}
function calculate_ramps(kw ,voltage,pow,eff){
    var d=1.73*voltage* pow*eff;

    console.log(d)
    return round(kw/d * 1000);
}
function calculate_kva(rla,voltage){
    return round(1.73*rla*voltage/1000);
}
function calculate_lr(rla){
	return round(rla * 6.5);
}
function calculate_flc(rla){
    return round(rla*1.25);
}
function calculate_kvar(kua, kw){
    return round(Math.sqrt(Math.pow(kua,2)-Math.pow(kw,2)));
}
function calculate_f_size(rla){
    return Math.round(rla * 1.75);
}
function calculate_wound(rla){

    if( Math.round(rla * 1.5) < 15){
        return 15;
    }
    else{
        return Math.round(rla * 1.5);
    }

}
function calculate_sq(rla){
    if(Math.round(rla * 2.5)<15){
        return 15;
    }
    else{
    return Math.round(rla * 2.5);
}
}
function calculate_torque(hp,rpm){
    //console.log("hi")
    return round(hp*5252/rpm);
}
function handle(tmp,data){
    tmp=data;
}
function update_hp_selection(id,data){
    var sel=document.getElementById(id);
    var op= sel.options;
    for(var i=op.length-1; i>=0;i--){
        if(op[i].value!="select"){

            sel.remove(i);

        }
    }
    var hp = data.split(" ");
    var prev = hp[0];
    if(prev!="-"){
        var option = document.createElement("option");
        option.value=prev;
        option.text=prev;
        sel.add(option);
    }
    for(var i=1; i<hp.length;i++){
        if(hp[i]!="-" && hp[i]!= ""){
            if(prev != hp[i]){
                
                //console.log(hp[i])
              
               var option = document.createElement("option");
               option.value=hp[i];
              option.text=hp[i];
             sel.add(option); 
            }
        }
        prev=hp[i];
      
    }
}
var pow;
var hp;
function update_div(id,data){
  
   // alert( document.getElementById(id).innerHTML);

}
function clear_select(sel ,op){
     for(var i=op.length-1; i>=0;i--){
        if(op[i].value!="select"){

            sel.remove(i);

        }
    }
}
function update_rpm_selection(id,data){
     var sel=document.getElementById(id);
    var op= sel.options;
    var code=["a","b","c","d"]
    clear_select(sel,op);
    var rpm = data.split(" ");
    for(var i = 0; i < rpm.length;i++){
        if(rpm[i]!= "-" && rpm[i]!= ""){
            console.log(code[i])
            var option = document.createElement("option");
            option.value=code[i];
              option.text=rpm[i];
             sel.add(option); 
        }
    }
}
function test(val,voltage,tbname,Col,Cell,Cell2,id){
    
    console.log("hi")
    $.ajax({
        type:"POST",
        url: 'base.php',
        data:{hp2:val,volt2:voltage,col2:Col,cell2:Cell,cell3:Cell2,table2:tbname},
        success:function(data) {   
                //alert(data)
                update_rpm_selection(id,data);
                //document.getElementById(id).innerHTML=data;
                //$("#directioninfo").append(data);
            }
      
    });
}

function calculate(){
 //var tp= '<?php vlookup(19.00,"Volt208","HP","Nema1");?>'
  var sel = document.getElementById("Insulation-Temp");
    var option=sel.options;
    clear_select(sel,option);
  
    var hp =parseValue(document.getElementById("output4").innerHTML);
    var rpm =parseFloat(document.getElementById("output5").innerHTML);
    var kw = parseFloat(document.getElementById("kw").innerHTML);
    var voltage= parseFloat(document.getElementById("output3").innerHTML);
    //var lf =parseValue(document.getElementById("output7").innerHTML);
	
      test(hp,document.getElementById("output3").innerHTML,"416volt","RPM","HP","volt","rpm_select");
    
    var pow= parseFloat(document.getElementById("Powerfac").innerHTML);
    var eff=parseFloat(document.getElementById("eff").innerHTML);
 
    if( voltage<=575 ){
    	if( voltage>0 && hp>0){
            
        update_nema(hp,"nema","fv","Column_"+document.getElementById("output3").innerHTML,"hp");
	      update_nema(hp,"nema1","at","Column_"+document.getElementById("output3").innerHTML,"hp");
	      update_nema(hp,"nema2","pw","Column_"+document.getElementById("output3").innerHTML,"hp");
	      update_nema(hp,"nema3","wd","Column_"+document.getElementById("output3").innerHTML,"hp");
	 }


 }
 else  {
 	
     document.getElementById('fv').innerHTML="there is no Nema for that Voltage";
      document.getElementById('at').innerHTML="there is no Nema for that Voltage";
       document.getElementById('pw').innerHTML="there is no Nema for that Voltage";
        document.getElementById('wd').innerHTML="there is no Nema for that Voltage";
 	
 }
     //  alert(document.getElementById("Powerfac").innerHTML)


    document.getElementById('ra').innerHTML =calculate_ramps(kw,voltage,pow/100,eff/100);
    var rla= parseFloat(document.getElementById("ra").innerHTML);
    document.getElementById("kva").innerHTML=(calculate_kva(rla,voltage));
    if(!isNaN(rla)){
          update_nema(calculate_wound(rla),"BkrSize","wound","Bkr_Fuse","Bkr_Fuse");
          update_nema(calculate_sq(rla),"BkrSize","sq","Bkr_Fuse","Bkr_Fuse");
             update_nema(calculate_f_size(rla),"BkrSize","td","Bkr_Fuse","Bkr_Fuse");
       

       
         var op1 = document.createElement("option");
            op1.value=60;
            op1.text=60;
            sel.add(op1);
        if(rla>=100){
            var op2 = document.createElement("option");
            op2.value=75;
            op2.text=75;
             var op3 = document.createElement("option");
            op3.value=90;
            op3.text=90;
            sel.add(op2);
            sel.add(op3);


        }
    }
    var kva= parseFloat(document.getElementById("kva").innerHTML);
    document.getElementById("kvars").innerHTML=calculate_kvar(kva,kw);
    document.getElementById("torque").innerHTML=calculate_torque(hp,rpm);
    document.getElementById("flc").innerHTML=calculate_flc(rla);
      document.getElementById("FLA").innerHTML=calculate_flc(rla);
    document.getElementById("lr").innerHTML=calculate_lr(rla);
   
             
       //console.log("wound:",calculate_wound(rla));
   

       cable_calc();



}
function update_nema(val,tbname,Id,voltage,Cell){
    
    var tmp=null;
    var id = Id;
    //console.log("hi")
       $.ajax({

        type:"POST",
        url: '/base.php',
        data:{hp:val,volt:voltage,cell:Cell,table:tbname},
      
        success:function(data){
            if(id!="hp_select"){
                    
                  document.getElementById(id).innerHTML=data;
              
               
                 //  $("#"+id).load(" #"+id);
            }

            else{
                update_hp_selection(id,data);
            }

        }
    })
    
}
function round(num){
    return Math.round(num*100)/100;
}
function calculate_kw(hp){
    return round(hp * 746/1000);
}
function parseValue(s){
    if(s.indexOf("/")!=-1){
        var array=s.split("/");
        return parseFloat(array[0])/parseInt(array[1])
    }
    else{
        return parseFloat(s);
    }

}
function calculate_hp(hp){

}
function outputValue3(item){
    console.log(item.id);
    voltage= parseFloat(item.value);
    
      update_nema(item.value,"416volt","hp_select","HP","volt")
      
    document.getElementById('output3').innerHTML = item.value;
    calculate();
}

function outputValue2(item){
    console.log(item.id);
    document.getElementById('output2').innerHTML = item.value;
    calculate();
}
function outputValue5(item){
    var rpm = item.options[item.selectedIndex];
    document.getElementById('output5').innerHTML = rpm.text;
     var lookup=  document.getElementById('output3').innerHTML + document.getElementById('output4').innerHTML+item.value;
  
    update_nema(lookup,"416volt","Powerfac","FULLp","Lookup");
 
    update_nema(lookup,"416volt","eff","FULLe","Lookup");
      
    var sendDate = (new Date()).getTime();

$.ajax({
    
    type: "HEAD", 
    url: "base.php",
    success: function(){

        var receiveDate = (new Date()).getTime();

        var responseTimeMs = receiveDate - sendDate;
        //alert("server response time " + responseTimeMs);
        setTimeout(function(){
            
            calculate()


        },responseTimeMs);
   

    }
});
    
function outputValue7(item){
    document.getElementById('output7').innerHTML = item.value;
    calculate();
}



}
function outputValue6(item){
    document.getElementById('output6').innerHTML = item.value;
    calculate();
}

function outputValue4(item){

    document.getElementById('output4').innerHTML = item.value;
  
  
    kw=calculate_kw(parseValue(item.value));
    document.getElementById('kw').innerHTML=kw;
    calculate();
}
function cheak_us(code){
      if(code == "NEC"){
         return true;
        }
        else{
            return false;
        }
}


function clear_table(){
    document.getElementById("Length").innerHTML="";
      document.getElementById("ohms").innerHTML="";
      document.getElementById("VDrop").innerHTML="";

}
//function calculate_torque()
function outputValuec1(item){
   // console.log(item.value);
   clear_table();
     generate_options(item.value);
   var id = document.getElementById('lngth');
   var length_btn = document.getElementById('cbl');
   update_facter(item.value,document.getElementById("Ctype").innerHTML);
    if(cheak_us(item.value)){
         
        id.innerHTML= "Apporx.Lgth (Ft)";
        length_btn.innerText="Cable Length(Ft)";

    }
    else{
        id.innerHTML= "Apporx.Lgth (m)";
         length_btn.innerText="Cable Length(m)";
    }
    document.getElementById('outputc1').innerHTML = item.value;
    calculate();
}
function outputValue1(item){
    //console.log(item.value);
    document.getElementById('output1').innerHTML = item.value;
    calculate();
}
function mtag(e){
    //  evt.preventDefault();
    if(e.keyCode==13){
        var summary_table= document.getElementById("summary");


        document.getElementById("mt").innerHTML= document.getElementById("motorid").value;
      
        document.getElementById("motorid").value = "";
    }
}
function mfun(e){
    if(e.keyCode==13){
        document.getElementById("mf").innerHTML = document.getElementById("motorfunction").value;//f
        document.getElementById("motorfunction").value = "";
    }
}

function display (id,notes) {
    document.getElementById(id).style.display="block"
        document.getElementById(notes).style.display="block";
    var def=document.getElementsByClassName('default')
    for(var i=0;i<def.length;i++){
        def[i].style.display="none"
    }
}

function hide (id,notes) {
    document.getElementById(id).style.display="none"
    document.getElementById(notes).style.display="none";
   var def=document.getElementsByClassName('default')
    for(var i=0;i<def.length;i++){
        def[i].style.display="block"
    }
}


