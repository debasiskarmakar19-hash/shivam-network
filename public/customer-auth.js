/* Shivam Network customer phone OTP linking + SMS password reset */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const status=msg=>{if($("otpStatus"))$("otpStatus").textContent=msg};
const phoneE164=value=>{const d=String(value||"").replace(/\D/g,"");return d.length===10?"+91"+d:""};
let verifier=null,flowConfirmation=null,resetEmail="";
function clearVerifier(){if(verifier){verifier.clear();verifier=null}if($("authRecaptcha"))$("authRecaptcha").innerHTML=""}
async function getVerifier(){
 if(!verifier){verifier=new firebase.auth.RecaptchaVerifier("authRecaptcha",{size:"normal"},customerAuth);await verifier.render()}
 return verifier;
}
function buildUI(){
 const login=$("accountLogin"),profile=$("customerProfileTab");
 if(!login||!profile)return;
 const password=$("loginPassword");
 if(password&&!$("registerPhoneNumber")){
  const label=document.createElement("label");label.htmlFor="registerPhoneNumber";label.textContent="নতুন অ্যাকাউন্টের মোবাইল নম্বর";
  const input=document.createElement("input");input.className="field";input.id="registerPhoneNumber";input.type="tel";input.inputMode="numeric";input.maxLength=10;input.placeholder="১০ সংখ্যার নম্বর — OTP যাচাই হবে";
  password.insertAdjacentElement("afterend",input);input.insertAdjacentElement("beforebegin",label);
 }
 const reset=$("resetEmailPassword");
 if(reset&&!$("passwordResetPanel")){
  const panel=document.createElement("div");panel.id="passwordResetPanel";panel.hidden=true;
  panel.innerHTML='<label for="resetPhoneNumber">রেজিস্টার করা ও আগে যাচাই করা মোবাইল নম্বর</label><input class="field" id="resetPhoneNumber" type="tel" inputmode="numeric" maxlength="10" placeholder="১০ সংখ্যার নম্বর"><button class="btn" id="sendPasswordResetOtp" type="button">SMS OTP পাঠান</button><div id="resetOtpStep" hidden><label for="resetOtpCode">SMS OTP</label><input class="field" id="resetOtpCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="৬ সংখ্যার OTP"><button class="btn blue" id="confirmPasswordResetOtp" type="button">OTP যাচাই করুন</button></div><div id="resetNewPasswordStep" hidden><label for="resetNewPassword">নতুন পাসওয়ার্ড</label><input class="field" id="resetNewPassword" type="password" minlength="6" autocomplete="new-password"><label for="resetConfirmPassword">নতুন পাসওয়ার্ড আবার লিখুন</label><input class="field" id="resetConfirmPassword" type="password" minlength="6" autocomplete="new-password"><button class="btn blue" id="completePasswordReset" type="button">নতুন পাসওয়ার্ড সেভ করুন</button></div>';
  reset.insertAdjacentElement("afterend",panel);
 }
 if(!$("authRecaptcha")){const box=document.createElement("div");box.id="authRecaptcha";box.style.margin="12px 0";login.insertAdjacentElement("afterend",box)}
 if(profile&&!$("phoneOtpPanel")){
  const box=document.createElement("section");box.className="panel";box.id="phoneOtpPanel";
  box.innerHTML='<h3>📱 মোবাইল নম্বর যাচাই</h3><p class="note">পাসওয়ার্ড ভুলে গেলে SMS OTP দিয়ে নতুন পাসওয়ার্ড সেট করতে এই নম্বর যাচাই করুন।</p><label for="verifyPhoneNumber">মোবাইল নম্বর</label><input class="field" id="verifyPhoneNumber" type="tel" inputmode="numeric" maxlength="10" placeholder="১০ সংখ্যার ভারতীয় নম্বর"><button class="btn" id="sendPhoneVerificationOtp" type="button">মোবাইলে OTP পাঠান</button><div id="phoneOtpConfirmArea" hidden><label for="phoneVerificationCode">SMS OTP</label><input class="field" id="phoneVerificationCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="৬ সংখ্যার OTP"><button class="btn blue" id="confirmPhoneVerificationOtp" type="button">মোবাইল নম্বর যাচাই করুন</button></div><p class="otp-status" id="phoneOtpStatus" aria-live="polite"></p>';
  profile.insertBefore(box,profile.firstChild);
 }
}
async function sendLinkOtp(){
 const phone=phoneE164($("verifyPhoneNumber").value);
 if(!phone)throw Error("সঠিক ১০ সংখ্যার ভারতীয় মোবাইল নম্বর লিখুন।");
 if(!customerAuth.currentUser)throw Error("আগে Email ও Password দিয়ে লগইন করুন।");
 flowConfirmation=await customerAuth.currentUser.linkWithPhoneNumber(phone,await getVerifier());
 $("phoneOtpConfirmArea").hidden=false;
 $("phoneOtpStatus").textContent="OTP পাঠানো হয়েছে। SMS-এর ৬ সংখ্যার কোড লিখুন।";
}
function bind(){
 $("emailRegister")?.addEventListener("click",async e=>{
  e.preventDefault();e.stopImmediatePropagation();
  const email=$("loginEmail").value.trim(),password=$("loginPassword").value,phone=$("registerPhoneNumber").value.trim();
  if(!email||password.length<6||!phoneE164(phone)){status("সঠিক Email, কমপক্ষে ৬ অক্ষরের Password এবং ১০ সংখ্যার মোবাইল নম্বর দিন।");return}
  try{
   status("অ্যাকাউন্ট তৈরি হচ্ছে…");
   await customerAuth.createUserWithEmailAndPassword(email,password);
   $("verifyPhoneNumber").value=phone;
   $("profilePhoneNumber").value=phone;
   status("অ্যাকাউন্ট তৈরি হয়েছে। মোবাইল OTP যাচাই শুরু হচ্ছে…");
   await sendLinkOtp();
   status("অ্যাকাউন্ট তৈরি হয়েছে এবং মোবাইলে OTP পাঠানো হয়েছে। প্রোফাইলে OTP যাচাই করুন।");
  }catch(err){status(err.code==="auth/email-already-in-use"?"এই Email-এ অ্যাকাউন্ট আছে। Login করুন।":(err.message||"অ্যাকাউন্ট তৈরি বা OTP পাঠানো যায়নি। Login করে প্রোফাইল থেকে নম্বর যাচাই করুন।"))}
 },true);
 $("resetEmailPassword")?.addEventListener("click",e=>{
  e.preventDefault();e.stopImmediatePropagation();
  $("passwordResetPanel").hidden=!$("passwordResetPanel").hidden;
  status("SMS OTP-এর জন্য আগে যাচাই করা মোবাইল নম্বর দিন।");
 },true);
 $("sendPhoneVerificationOtp")?.addEventListener("click",async()=>{try{await sendLinkOtp()}catch(err){$("phoneOtpStatus").textContent=err.message||"OTP পাঠানো যায়নি।"}});
 $("confirmPhoneVerificationOtp")?.addEventListener("click",async()=>{
  try{
   if(!flowConfirmation)throw Error("আগে OTP পাঠান।");
   const code=$("phoneVerificationCode").value.trim();if(!/^\d{6}$/.test(code))throw Error("৬ সংখ্যার OTP লিখুন।");
   const result=await flowConfirmation.confirm(code);await result.user.reload();
   $("phoneOtpStatus").textContent="✓ মোবাইল নম্বর যাচাই সম্পন্ন হয়েছে। এই নম্বর Forgot Password-এ ব্যবহার করতে পারবেন।";
   $("profilePhoneNumber").value=(result.user.phoneNumber||"").replace(/^\+91/,"");
   flowConfirmation=null;clearVerifier();
  }catch(err){$("phoneOtpStatus").textContent=err.message||"OTP যাচাই হয়নি।"}
 });
 $("sendPasswordResetOtp")?.addEventListener("click",async()=>{
  const email=$("loginEmail").value.trim(),phone=phoneE164($("resetPhoneNumber").value.trim());
  if(!email||!phone){status("Login Email এবং সেই অ্যাকাউন্টে আগে যাচাই করা মোবাইল নম্বর দিন।");return}
  try{
   resetEmail=email.toLowerCase();window.__passwordResetFlow=true;
   flowConfirmation=await customerAuth.signInWithPhoneNumber(phone,await getVerifier());
   $("resetOtpStep").hidden=false;status("SMS OTP পাঠানো হয়েছে।");
  }catch(err){window.__passwordResetFlow=false;clearVerifier();status(err.message||"OTP পাঠানো যায়নি।")}
 });
 $("confirmPasswordResetOtp")?.addEventListener("click",async()=>{
  try{
   if(!flowConfirmation)throw Error("আগে OTP পাঠান।");
   const code=$("resetOtpCode").value.trim();if(!/^\d{6}$/.test(code))throw Error("৬ সংখ্যার OTP লিখুন।");
   const result=await flowConfirmation.confirm(code);
   if((result.user.email||"").toLowerCase()!==resetEmail){
    await customerAuth.signOut();window.__passwordResetFlow=false;
    throw Error("এই মোবাইল নম্বরটি দেওয়া Email অ্যাকাউন্টের সঙ্গে যুক্ত নয়।");
   }
   $("resetNewPasswordStep").hidden=false;status("মোবাইল OTP যাচাই হয়েছে। নতুন পাসওয়ার্ড দিন।");
   flowConfirmation=null;clearVerifier();
  }catch(err){status(err.message||"OTP যাচাই করা যায়নি।")}
 });
 $("completePasswordReset")?.addEventListener("click",async()=>{
  const p=$("resetNewPassword").value,c=$("resetConfirmPassword").value;
  if(p.length<6||p!==c){status("দুটি পাসওয়ার্ড একই হতে হবে এবং কমপক্ষে ৬ অক্ষরের হতে হবে।");return}
  try{
   const user=customerAuth.currentUser;
   if(!user||!user.email||user.email.toLowerCase()!==resetEmail)throw Error("অ্যাকাউন্ট যাচাইয়ের সেশন শেষ হয়েছে। আবার OTP নিন।");
   await user.updatePassword(p);await customerAuth.signOut();window.__passwordResetFlow=false;
   $("passwordResetPanel").hidden=true;$("resetOtpStep").hidden=true;$("resetNewPasswordStep").hidden=true;
   status("পাসওয়ার্ড সফলভাবে বদলানো হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে Login করুন।");
  }catch(err){status(err.message||"পাসওয়ার্ড বদলানো যায়নি।")}
 });
}
function init(){buildUI();bind()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();