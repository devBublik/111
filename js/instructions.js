function instructionsListOpen(){
    document.querySelector('#instructions-select').classList.add('active')
    catchClick()
}

function catchClick() {
    document.addEventListener( 'click', (e) => {
        const target = e.target;
        const its_menu = target == document.querySelector('#instructions-select') || document.querySelector('#instructions-select').contains(target) || document.querySelector('.instructions-link').contains(target);
        const menu_is_active = document.querySelector('#instructions-select').classList.contains('active');
        
        if ( !its_menu && menu_is_active) {
            document.querySelector('#instructions-select').classList.remove('active')
        }
    })
}

