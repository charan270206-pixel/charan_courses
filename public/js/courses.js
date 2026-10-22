async function loadCourseCards(){
 const root=document.getElementById('course-list');
 try{const rows=await api('/api/courses');root.innerHTML=rows.length?rows.map((c,i)=>`<article class="course-card"><div class="course-top"><div class="course-icon">${['💻','🐍','☕','📊','🎨','🧠'][i%6]}</div><span class="pill">${escapeHTML(c.course_code)}</span></div><h3>${escapeHTML(c.course_name)}</h3><p>Build skills with a guided learning path.</p><div class="course-meta"><div><small style="color:var(--muted)">Duration</small><div><strong>${escapeHTML(c.duration)}</strong></div></div><div style="text-align:right"><small style="color:var(--muted)">Course fee</small><div class="fee">₹${Number(c.fee).toLocaleString('en-IN')}</div></div></div><div style="margin-top:17px"><a class="btn primary" href="registrations.html">Register →</a> <a class="btn secondary" href="add-course.html">Manage</a></div></article>`).join(''):'<div class="panel">No courses yet. <a class="textlink" href="add-course.html">Add a course →</a></div>';}
 catch(e){root.innerHTML=`<div class="panel">${escapeHTML(e.message)}. Start the server and check MySQL.</div>`;}
}
loadCourseCards();
