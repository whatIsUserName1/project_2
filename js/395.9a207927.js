"use strict";(self["webpackChunkvue_event"]=self["webpackChunkvue_event"]||[]).push([[395],{7395:function(t,e,a){a.r(e),a.d(e,{default:function(){return c}});var o=function(){var t=this,e=t._self._c;return e("div",[e("div",{staticClass:"container-fluid"},[e("el-row",{staticClass:"spannel_list",attrs:{gutter:10}},[e("el-col",{attrs:{sm:6,xs:12}},[e("div",{staticClass:"spannel"},[e("em",[t._v("10015")]),e("span",[t._v("篇")]),e("b",[t._v("总文章数")])])]),e("el-col",{attrs:{sm:6,xs:12}},[e("div",{staticClass:"spannel scolor01"},[e("em",[t._v("123")]),e("span",[t._v("篇")]),e("b",[t._v("日新增文章数")])])]),e("el-col",{attrs:{sm:6,xs:12}},[e("div",{staticClass:"spannel scolor02"},[e("em",[t._v("35")]),e("span",[t._v("条")]),e("b",[t._v("评论总数")])])]),e("el-col",{attrs:{sm:6,xs:12}},[e("div",{staticClass:"spannel scolor03"},[e("em",[t._v("123")]),e("span",[t._v("条")]),e("b",[t._v("日新增评论数")])])])],1)],1),e("div",{staticClass:"container-fluid"},[e("el-row",{staticClass:"curve-pie",attrs:{gutter:10}},[e("el-col",{attrs:{sm:16,xs:16}},[e("div",{staticClass:"gragh_pannel",attrs:{id:"curve_show"}})]),e("el-col",{attrs:{sm:8,xs:8}},[e("div",{staticClass:"gragh_pannel",attrs:{id:"pie_show"}})])],1)],1),t._m(0)])},s=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"container-fluid"},[e("div",{staticClass:"column_pannel",attrs:{id:"column_show"}})])}],n=(a(7658),a(9428)),l={name:"my-home",mounted(){this.setCurveChartFn(),this.picChartFn(),this.columnChartFn()},methods:{setCurveChartFn(){const t=n.init(document.getElementById("curve_show")),e=[{count:36,date:"2022-10-10"},{count:52,date:"2022-10-11"},{count:78,date:"2022-10-12"},{count:85,date:"2022-10-13"},{count:65,date:"2022-10-14"},{count:72,date:"2022-10-15"},{count:88,date:"2022-10-16"},{count:64,date:"2022-10-17"},{count:72,date:"2022-10-18"},{count:90,date:"2022-10-19"},{count:96,date:"2022-10-20"},{count:100,date:"2022-10-21"},{count:102,date:"2022-10-22"},{count:110,date:"22022-10-23"},{count:123,date:"2022-10-25"},{count:100,date:"2022-10-26"},{count:132,date:"2022-10-27"},{count:146,date:"2022-10-28"},{count:200,date:"2022-10-29"},{count:180,date:"2022-10-30"},{count:163,date:"2022-10-31"},{count:110,date:"2022-11-01"},{count:80,date:"2022-11-02"},{count:82,date:"2022-11-03"},{count:70,date:"2022-11-04"},{count:65,date:"2022-11-05"},{count:54,date:"2022-11-06"},{count:40,date:"2022-11-07"},{count:45,date:"2022-11-08"},{count:38,date:"2022-11-09"}],a=[],o=[];for(let n=0;n<e.length;n++)a.push(e[n].count),o.push(e[n].date);const s={title:{text:"月新增文章数",left:"center",top:"10"},tooltip:{trigger:"axis"},legend:{data:["新增文章"],top:"40"},toolbox:{show:!0,feature:{mark:{show:!0},dataView:{show:!0,readOnly:!1},magicType:{show:!0,type:["line","bar"]},restore:{show:!0},saveAsImage:{show:!0}}},xAxis:[{name:"日",type:"category",boundaryGap:!1,data:o}],yAxis:[{name:"月新增文章数",type:"value"}],series:[{name:"新增文章",type:"line",smooth:!0,areaStyle:{type:"default"},itemStyle:{color:"#f80",lineStyle:{color:"#f80"}},data:a}],grid:{show:!0,x:50,x2:50,y:80,height:220}};t.setOption(s)},picChartFn(){const t=n.init(document.getElementById("pie_show")),e={title:{top:10,text:"分类文章数量比",x:"center"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},color:["#5885e8","#13cfd5","#00ce68","#ff9565"],legend:{x:"center",top:65,data:["奇趣事","会生活","爱旅行","趣美味"]},toolbox:{show:!0,x:"center",top:35,feature:{mark:{show:!0},dataView:{show:!0,readOnly:!1},magicType:{show:!0,type:["pie","funnel"],option:{funnel:{x:"25%",width:"50%",funnelAlign:"left",max:1548}}},restore:{show:!0},saveAsImage:{show:!0}}},series:[{name:"访问来源",type:"pie",radius:["45%","60%"],center:["50%","65%"],data:[{value:300,name:"奇趣事"},{value:100,name:"会生活"},{value:260,name:"爱旅行"},{value:180,name:"趣美味"}]}]};t.setOption(e)},columnChartFn(){const t=n.init(document.getElementById("column_show")),e={title:{text:"文章访问量",left:"center",top:"10"},tooltip:{trigger:"axis"},legend:{data:["奇趣事","会生活","爱旅行","趣美味"],top:"40"},toolbox:{show:!0,feature:{mark:{show:!0},dataView:{show:!0,readOnly:!1},magicType:{show:!0,type:["line","bar"]},restore:{show:!0},saveAsImage:{show:!0}}},xAxis:[{type:"category",data:["1月","2月","3月","4月","5月"]}],yAxis:[{name:"访问量",type:"value"}],series:[{name:"奇趣事",type:"bar",barWidth:20,areaStyle:{type:"default"},itemStyle:{color:"#fd956a"},data:[800,708,920,1090,1200]},{name:"会生活",type:"bar",barWidth:20,areaStyle:{type:"default"},itemStyle:{color:"#2bb6db"},data:[400,468,520,690,800]},{name:"爱旅行",type:"bar",barWidth:20,areaStyle:{type:"default"},itemStyle:{color:"#13cfd5"},data:[500,668,520,790,900]},{name:"趣美味",type:"bar",barWidth:20,areaStyle:{type:"default"},itemStyle:{color:"#00ce68"},data:[600,508,720,890,1e3]}],grid:{show:!0,x:50,x2:30,y:80,height:260},dataZoom:[{start:0,end:100-1e3/31,type:"slider",show:!0,xAxisIndex:[0],handleSize:0,height:8,left:45,right:50,bottom:26,handleColor:"#ddd",handleStyle:{borderColor:"#cacaca",borderWidth:"1",shadowBlur:2,background:"#ddd",shadowColor:"#ddd"}}]};t.setOption(e)}}},d=l,r=a(1001),i=(0,r.Z)(d,o,s,!1,null,"d01fc990",null),c=i.exports}}]);
//# sourceMappingURL=395.9a207927.js.map