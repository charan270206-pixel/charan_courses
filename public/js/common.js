document.querySelectorAll('.navlinks>a').forEach(a=>{
 const page=location.pathname.split('/').pop()||'index.html';
 if(a.getAttribute('href')===page)a.classList.add('active');
});
async function api(url, options={}) {
 const response = await fetch(url, {headers:{'Content-Type':'application/json'}, ...options});
 const data = await response.json().catch(()=>({error:'Unexpected server response'}));
 if(!response.ok) throw new Error(data.error || 'Request failed');
 return data;
}
function showMessage(id, text, type='ok') {
 const el=document.getElementById(id); if(!el)return;
 el.textContent=text; el.className='message show '+type;
}
function escapeHTML(value='') { return String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
