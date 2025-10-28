// App-wide script: session enforcement and logout behavior
(function(){
  function isAuthenticated(){
    try {
      return !!localStorage.getItem('ticketapp_session');
    } catch(e){
      return false;
    }
  }

  // If page sets window.pageProtected = true (templates do), enforce session
  if (window.pageProtected) {
    if (!isAuthenticated()) {
      // session missing — set a friendly message for the login screen then redirect
      try { localStorage.setItem('ticketapp_message', 'Your session has expired — please log in again.'); } catch(e) {}
      window.location.href = '/auth/login.php';
    }
  }

  // attach logout handler if present
  document.addEventListener('click', function(e){
    if (e.target && e.target.id === 'logoutBtn') {
      localStorage.removeItem('ticketapp_session');
      // redirect to landing
      window.location.href = '/';
    }
  });
})();
