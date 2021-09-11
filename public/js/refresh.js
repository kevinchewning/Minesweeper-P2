const button = document.querySelector('#refresh-button')

button.addEventListener('click', function(e) {
    e.stopPropagation();

    location.reload();
})