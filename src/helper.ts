export const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const axiosConfig = {
  headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "SESSION_ID": "",
  }
};

export const handleLogout = () => {
  localStorage.clear();
  window.location.reload();
};

export const handleRouteRole = () => {
  if (!localStorage.getItem("user") && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }

  if (localStorage.getItem("user") && window.location.pathname === "/") {
    const user = JSON.parse(localStorage.getItem("user") ?? '');
    if (user.role === 'admin') {
      window.location.href = '/requests';
    } else {
      window.location.href = '/form';
    }
  }

  if (localStorage.getItem("user") && window.location.pathname.includes('/requests') && window.location.pathname.includes('/form')) {
    const user = JSON.parse(localStorage.getItem("user") ?? '');
    if (user.role === 'admin') {
      window.location.href = '/requests';
    } else {
      window.location.href = '/form';
    }
  }

  if (window.location.pathname.includes('/requests') || window.location.pathname.includes('/form')) {
    const user = JSON.parse(localStorage.getItem("user") ?? '');
    if (window.location.pathname.includes('/requests') && user.role === 'user') {
      window.location.href = '/form';
    }
    if (window.location.pathname.includes('/form') && user.role === 'admin') {
      window.location.href = '/requests';
    }
  }
};