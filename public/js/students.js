let studentRows=[];
const form=document.getElementById('student-form-el');
async function loadStudents(){
 try{studentRows=await api('/api/students'); renderStudents(studentRows);}
 catch(e){document.getElementById('students-table').innerHTML=`<tr><td colspan="4" class="empty">${escapeHTML(e.message)}. Start the server and check MySQL.</td></tr>`;}
}
function renderStudents(rows){
 const tbody=document.getElementById('students-table');
 tbody.innerHTML=rows.length?rows.map(s=>`<tr><td><strong>${escapeHTML(s.full_name)}</strong></td><td>${escapeHTML(s.email)}</td><td>${escapeHTML(s.phone||'—')}</td><td><button class="smallbtn" onclick="editStudent(${s.id})">Edit</button><button class="smallbtn del" onclick="deleteStudent(${s.id})">Delete</button></td></tr>`).join(''):'<tr><td colspan="4" class="empty">No students yet. Add the first student using the form.</td></tr>';
}
form.addEventListener('submit',async e=>{
 e.preventDefault(); const id=document.getElementById('student-id').value;
 const payload={full_name:document.getElementById('full_name').value,email:document.getElementById('email').value,phone:document.getElementById('phone').value};
 try{await api(id?`/api/students/${id}`:'/api/students',{method:id?'PUT':'POST',body:JSON.stringify(payload)});showMessage('student-message',id?'Student updated.':'Student added.');form.reset();document.getElementById('student-id').value='';document.getElementById('student-form-title').textContent='Add a student';document.getElementById('student-submit').textContent='Add Student';document.getElementById('student-cancel').hidden=true;await loadStudents();}
 catch(e){showMessage('student-message',e.message,'error');}
});
window.editStudent=id=>{const s=studentRows.find(x=>x.id===id);if(!s)return;document.getElementById('student-id').value=s.id;document.getElementById('full_name').value=s.full_name;document.getElementById('email').value=s.email;document.getElementById('phone').value=s.phone||'';document.getElementById('student-form-title').textContent='Edit student';document.getElementById('student-submit').textContent='Save Changes';document.getElementById('student-cancel').hidden=false;location.hash='student-form';};
window.deleteStudent=async id=>{if(!confirm('Delete this student? Any linked registrations will also be deleted.'))return;try{await api('/api/students/'+id,{method:'DELETE'});await loadStudents();}catch(e){alert(e.message);}};
document.getElementById('student-cancel').addEventListener('click',()=>{form.reset();document.getElementById('student-id').value='';document.getElementById('student-form-title').textContent='Add a student';document.getElementById('student-submit').textContent='Add Student';document.getElementById('student-cancel').hidden=true;});
document.getElementById('student-search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();renderStudents(studentRows.filter(s=>[s.full_name,s.email,s.phone].some(v=>String(v||'').toLowerCase().includes(q))));});
loadStudents();
