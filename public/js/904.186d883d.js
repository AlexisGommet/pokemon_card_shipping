"use strict";(self["webpackChunkpokemon_card_shipping"]=self["webpackChunkpokemon_card_shipping"]||[]).push([[904],{4904:function(t,e,n){n.r(e),n.d(e,{default:function(){return _}});var a=n(3396),o=n(7139),u=n(6035),s=n(4870);const i=t=>((0,a.dD)("data-v-2014093e"),t=t(),(0,a.Cn)(),t),l={class:"basket"},c=["onClick"],r=i((()=>(0,a._)("br",null,null,-1))),d=i((()=>(0,a._)("br",null,null,-1))),h=i((()=>(0,a._)("br",null,null,-1)));var g={__name:"BasketShow",props:["auth"],setup(t){const e=t,n=(0,u.ad)(),i=(0,u.IO)((0,u.hJ)(n,"Cards"),(0,u.ar)("user","==",e.auth.uid),(0,u.ar)("status","==","pending"),(0,u.Xo)("createdAt")),g=(0,s.iH)();async function p(){let t=[];await(0,u.PL)(i).then((e=>{e.forEach((e=>{let n=e.data();n.id=e.id,t.push(n)})),g.value=t}))}function w(t){const e=new Date(1e3*t.createdAt.seconds),n=e.getDate()<10?"0"+e.getDate():e.getDate(),a=e.getMonth()+1<10?"0"+(e.getMonth()+1):e.getMonth()+1,o=e.getFullYear(),u=e.getHours()<10?"0"+e.getHours():e.getHours(),s=e.getMinutes()<10?"0"+e.getMinutes():e.getMinutes(),i=e.getSeconds()<10?"0"+e.getSeconds():e.getSeconds();return`${n}/${a}/${o} à ${u}:${s}:${i}`}async function _(t){await(0,u.oe)((0,u.JU)(n,"Cards",t)).then((()=>{g.value.splice(g.value.findIndex((e=>e.id===t)),1)})).catch((t=>{console.log(t)}))}async function v(){const t={quantity:""+g.value.length};try{const e=await fetch("https://us-central1-pokemoncardshipping.cloudfunctions.net/checkout",{method:"post",body:JSON.stringify(t),headers:{"Content-Type":"application/json"}}),n=await e.json();window.location.href=n.url}catch(e){window.alert("Erreur")}}return(0,a.bv)((()=>{p()})),(t,e)=>((0,a.wg)(),(0,a.iD)("div",l,[(0,a._)("button",{onClick:v,class:"signOut"},"Checkout"),((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(g.value,((t,e)=>((0,a.wg)(),(0,a.iD)("div",{key:e},[(0,a._)("h4",null,[(0,a.Uk)("Carte "+(0,o.zw)(e+1),1),(0,a._)("button",{class:"delete",onClick:e=>_(t.id)},"X",8,c)]),(0,a._)("div",null," Propriété 1 : "+(0,o.zw)(t.text1),1),r,(0,a._)("div",null," Propriété 2 : "+(0,o.zw)(t.text2),1),d,(0,a._)("div",null," Propriété 3 : "+(0,o.zw)(t.text3),1),h,(0,a._)("div",null," Ajoutée le : "+(0,o.zw)(w(t)),1)])))),128))]))}},p=n(89);const w=(0,p.Z)(g,[["__scopeId","data-v-2014093e"]]);var _=w}}]);
//# sourceMappingURL=904.186d883d.js.map