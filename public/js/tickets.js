// Tickets CRUD using localStorage under key 'ticketapp_tickets'
(function(){
  const STORAGE_KEY = 'ticketapp_tickets';
  const allowedStatuses = ['open','in_progress','closed'];

  function showToast(id, message, type = 'error'){
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.className = 'toast ' + type;
    el.style.display = 'block';
    // Announce to screen readers via the global live region if present
    const live = document.getElementById('ariaLive');
    if (live) live.textContent = message;
    setTimeout(()=>{ el.style.display = 'none'; }, 2500);
  }

  function loadTickets(){
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch(e) {
      showToast('ticketsToast', 'Failed to load tickets. Data appears malformed. Resetting storage.');
      try { localStorage.removeItem(STORAGE_KEY); } catch(err) {}
      return [];
    }
  }
  function saveTickets(tickets){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      return true;
    } catch(e) {
      showToast('ticketsToast', 'Failed to save tickets. Local storage may be full.');
      return false;
    }
  }

  function statusClass(status){
    if (status === 'open') return 'badge open';
    if (status === 'in_progress') return 'badge in-progress';
    return 'badge closed';
  }

  function renderTickets(){
    const list = document.getElementById('ticketsList');
    if (!list) return;
    const tickets = loadTickets();
    list.innerHTML = tickets.map(t => `
      <div class="ticket-card card" data-id="${t.id}">
        <div class="ticket-head">
          <h4>${escapeHtml(t.title)}</h4>
          <span class="${statusClass(t.status)}">${t.status.replace('_',' ')}</span>
        </div>
        <p class="desc">${escapeHtml(t.description || '')}</p>
        <div class="ticket-actions">
          <button class="btn small editBtn">Edit</button>
          <button class="btn small danger deleteBtn">Delete</button>
        </div>
      </div>
    `).join('');
    updateDashboardCounts();
  }

  function updateDashboardCounts(){
    if (!document.getElementById('totalCount')) return;
    const tickets = loadTickets();
    const total = tickets.length;
    const open = tickets.filter(t=>t.status==='open').length;
    const closed = tickets.filter(t=>t.status==='closed').length;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('openCount').textContent = open;
    document.getElementById('closedCount').textContent = closed;
  }

  function openModal(mode, ticket){
    const modal = document.getElementById('ticketModal');
    if (!modal) return;
    // Save previously focused element to restore focus on close
    modal._previouslyFocused = document.activeElement;
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'block';
    document.getElementById('modalTitle').textContent = mode === 'edit' ? 'Edit Ticket' : 'Create Ticket';
    document.getElementById('title').value = ticket ? ticket.title : '';
    document.getElementById('status').value = ticket ? ticket.status : 'open';
    document.getElementById('description').value = ticket ? ticket.description : '';
    modal._mode = mode;
    modal._id = ticket ? ticket.id : null;
    // focus first form control
    const first = modal.querySelector('#title') || modal.querySelector('input,select,textarea,button');
    if (first) first.focus();
    // trap focus inside modal
    trapFocus(modal);
  }
  function closeModal(){
    const modal = document.getElementById('ticketModal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
    modal._mode = null; modal._id = null;
    releaseFocus(modal);
    // restore focus back to previously focused element
    try{ if (modal._previouslyFocused && modal._previouslyFocused.focus) modal._previouslyFocused.focus(); }catch(e){}
    clearFormErrors();
  }

  // Focus trap helpers
  function trapFocus(modal){
    if (!modal) return;
    function handleKey(e){
      if (e.key === 'Tab'){
        const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length -1];
        if (e.shiftKey){ if (document.activeElement === first){ e.preventDefault(); last.focus(); } }
        else { if (document.activeElement === last){ e.preventDefault(); first.focus(); } }
      }
      if (e.key === 'Escape'){
        closeModal();
      }
    }
    modal._trapHandler = handleKey;
    modal.addEventListener('keydown', handleKey);
  }
  function releaseFocus(modal){
    if (!modal || !modal._trapHandler) return;
    modal.removeEventListener('keydown', modal._trapHandler);
    modal._trapHandler = null;
  }

  function clearFormErrors(){
    ['titleError','statusError'].forEach(id=>{ const e = document.getElementById(id); if(e) e.textContent=''; });
  }

  function escapeHtml(s){
    return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function validateForm(data){
    let valid = true;
    if (!data.title || data.title.trim()===''){
      document.getElementById('titleError').textContent = 'Title is required.'; valid=false;
    } else if (data.title.length > 200){
      document.getElementById('titleError').textContent = 'Title must be under 200 characters.'; valid=false;
    } else document.getElementById('titleError').textContent = '';

    if (!allowedStatuses.includes(data.status)){
      document.getElementById('statusError').textContent = 'Invalid status.'; valid=false;
    } else document.getElementById('statusError').textContent = '';
    return valid;
  }

  // handlers
  document.addEventListener('DOMContentLoaded', function(){
    renderTickets();

    const createBtn = document.getElementById('createTicketBtn');
    if (createBtn) createBtn.addEventListener('click', ()=> openModal('create'));

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    const form = document.getElementById('ticketForm');
    if (form) form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = {
        title: document.getElementById('title').value.trim(),
        status: document.getElementById('status').value,
        description: document.getElementById('description').value.trim()
      };
      if (!validateForm(data)) return;
      const modal = document.getElementById('ticketModal');
      const mode = modal._mode;
      let tickets = loadTickets();
      if (mode === 'edit'){
        const id = modal._id;
        const idx = tickets.findIndex(t=>t.id===id);
        if (idx===-1){ showToast('ticketsToast','Failed to update ticket.'); closeModal(); return; }
        tickets[idx].title = data.title; tickets[idx].status = data.status; tickets[idx].description = data.description;
        saveTickets(tickets);
        showToast('ticketsToast','Ticket updated.','success');
      } else {
        const newTicket = { id: 't_'+Date.now(), title: data.title, status: data.status, description: data.description };
        tickets.unshift(newTicket);
        saveTickets(tickets);
        showToast('ticketsToast','Ticket created.','success');
      }
      closeModal();
      renderTickets();
    });

    // delegate edit/delete
    document.getElementById('ticketsList')?.addEventListener('click', function(e){
      const card = e.target.closest('.ticket-card');
      if (!card) return;
      const id = card.getAttribute('data-id');
      if (e.target.classList.contains('editBtn')){
        const tickets = loadTickets();
        const t = tickets.find(x=>x.id===id);
        if (!t) { showToast('ticketsToast','Ticket not found.'); return; }
        openModal('edit', t);
      }
      if (e.target.classList.contains('deleteBtn')){
        // show confirm
        const confirmModal = document.getElementById('confirmModal');
          confirmModal._previouslyFocused = document.activeElement;
          confirmModal.style.display = 'block';
          confirmModal._id = id;
          // focus confirm OK and trap
          const ok = confirmModal.querySelector('#confirmOk'); if (ok) ok.focus();
          trapFocus(confirmModal);
      }
    });

    // confirm modal handlers
    document.getElementById('confirmCancel')?.addEventListener('click', function(){
      const confirmModal = document.getElementById('confirmModal'); confirmModal.style.display='none'; confirmModal._id=null; releaseFocus(confirmModal); try{ if (confirmModal._previouslyFocused) confirmModal._previouslyFocused.focus(); }catch(e){}
    });
    document.getElementById('confirmOk')?.addEventListener('click', function(){
      const confirmModal = document.getElementById('confirmModal');
      const id = confirmModal._id; if (!id) return;
      let tickets = loadTickets();
      const idx = tickets.findIndex(t=>t.id===id);
      if (idx===-1){ showToast('ticketsToast','Ticket not found.'); confirmModal.style.display='none'; return; }
      tickets.splice(idx,1); saveTickets(tickets);
      confirmModal.style.display='none'; confirmModal._id=null; releaseFocus(confirmModal); try{ if (confirmModal._previouslyFocused) confirmModal._previouslyFocused.focus(); }catch(e){}
      showToast('ticketsToast','Ticket deleted.','success'); renderTickets();
    });

    // close modals when clicking outside content
    document.querySelectorAll('.modal').forEach(m => {
      m.addEventListener('click', function(e){ if (e.target === m) { m.style.display='none'; m._id=null; m._mode=null; } });
    });

  });

})();
