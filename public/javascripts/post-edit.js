// find post edit form
let postEditForm = document.addEventListener('submit', function(e) {
    // find length of uploaded images
    let imageUploads = document.getElementById('imageUpload').files.length;
    // find total number of existing images
    let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
    // find total number of potential deletions
    let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    
    // figure out if the form can be submited
    let newTotal = existingImgs - imgDeletions + imageUploads;
    if (newTotal > 4) {
        e.preventDefault();
        alert('You can only have a maximum of 4 images');
    }
})