let registrationRows=[];
async function loadOptions(){
 try{
  const [students,courses]=await Promise.all([api('/api/students'),api('/api/courses')]);
  document.getElementById('student-select').innerHTML='<option value="">Choose a student</option>'+students.map(s=>`<option value="${s.id}">${escapeHTML(s.full_name)} — ${escapeHTML(s.email)}</option>`).join('');
  document.getElementById('course-select').innerHTML='<option value="">Choose a course</option>'+courses.map(c=>`<option value="${c.id}">${escapeHTML(c.course_name)} (${escapeHTML(c.course_code)})</option>`).join('');
 }catch(e){showMessage('registration-message',e.message,'error');}
}
async function loadRegistrations(){try{registrationRows=await api('/api/registrations');renderRegistrations(registrationRows);}catch(e){document.getElementById('registrations-table').innerHTML=`<tr><td colspan="4" class="empty">${escapeHTML(e.message)}</td></tr>`;}}
function renderRegistrations(rows){document.getElementById('registrations-table').innerHTML=rows.length?rows.map(r=>`<tr><td><strong>${escapeHTML(r.full_name)}</strong><br><small style="color:var(--muted)">${escapeHTML(r.email)}</small></td><td>${escapeHTML(r.course_name)}<br><span class="pill">${escapeHTML(r.course_code)}</span></td><td>${new Date(r.registered_on).toLocaleDateString()}</td><td><button class="smallbtn del" onclick="deleteRegistration(${r.id})">Delete</button></td></tr>`).join(''):'<tr><td colspan="4" class="empty">No registrations yet.</td></tr>';}
document.getElementById('registration-form-el').addEventListener('submit',async e=>{e.preventDefault();try{await api('/api/registrations',{method:'POST',body:JSON.stringify({student_id:document.getElementById('student-select').value,course_id:document.getElementById('course-select').value})});showMessage('registration-message','Registration completed successfully.');await loadRegistrations();}catch(e){showMessage('registration-message',e.message,'error');}});
window.deleteRegistration=async id=>{if(!confirm('Delete this registration?'))return;try{await api('/api/registrations/'+id,{method:'DELETE'});await loadRegistrations();}catch(e){alert(e.message);}};
document.getElementById('registration-search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();renderRegistrations(registrationRows.filter(r=>[r.full_name,r.email,r.course_name,r.course_code].some(v=>String(v||'').toLowerCase().includes(q))));});
loadOptions();loadRegistrations();
