const components = document.querySelectorAll('.components');

export function navigate(id = 'home') {
    components.forEach(component => {
        history.replaceState({}, document.title, `/${id}`);
        component.style.display = component.getAttribute('id') === id ? 'block' : 'none';
    });
}