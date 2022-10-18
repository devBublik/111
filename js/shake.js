function shake(id){
    const element = document.querySelector(id);
    const classList = element.classList;

    if (classList.contains('shake1')){
        classList.remove('shake1');
        classList.add('shake2');
        return;
    }
    if (classList.contains('shake2')){
        classList.remove('shake2');
        classList.add('shake1');
        return;
    }
    classList.add('shake1')
}