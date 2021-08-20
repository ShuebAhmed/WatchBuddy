
import Swal from 'sweetalert2';

export const swalForm = (title, description, tags, callback) => {
    Swal.fire({
        title: title.length > 0 ? 'Update post' : 'Create post',
        html: `
            <input type="text" id="txt-title" class="swal2-input" required placeholder="Title" value="${title}" />
            <textarea id="txt-description" class="swal2-input" required placeholder="Description...">${description}</textarea>
            <input id="txt-tags" class="swal2-input" placeholder="Search Tags (comma separated)" value="${tags}" />`,
        showCancelButton: true,
        confirmButtonText: title.length > 0 ? 'Update' : 'Create',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            const title = document.getElementById('txt-title').value;
            const description = document.getElementById('txt-description').value;
            const tags = document.getElementById('txt-tags').value;
            if (!title || !description)
                return Swal.showValidationMessage(`Please provide post Title and Description fields.`);
        },
    }).then(result => {
        if(result.value) {
            const title = document.getElementById('txt-title').value;
            const description = document.getElementById('txt-description').value;
            const tags = document.getElementById('txt-tags').value;
            callback({title, description, tags});
        }
    });
}

export const swalDeleteForm = callback => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalRemoveLike = (title, callback) => {
    Swal.fire({
        title: title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalError = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: true
    });
}

export const swalSuccess = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 800
    });
}

export const swalInfo = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: true
    });
}

export const swalShare = url => {
    Swal.fire({
        title: "Copy post's public URL",
        html: `<input id="txt-share-url" type="text" class="swal2-input" readonly value="${url}" />`,
        position: 'top-end',
        showConfirmButton: true,
        confirmButtonText: 'Copy URL',
        showCancelButton: true,
        cancelButtonText: 'Close'
    }).then(result => {
        if (result.value) {
            document.getElementById('txt-share-url').select();
            document.execCommand("copy");
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Copied!',
                showConfirmButton: false,
                timer: 800
            });
        }
    });
}

export const swalComment = callback => {
    Swal.fire({
        title: "Add Comment",
        html: `<input id="txt-comment" type="text" class="swal2-input" />`,
        showConfirmButton: true,
        confirmButtonText: 'Save',
        showCancelButton: true,
        cancelButtonText: 'Close'
    }).then(result => {
        if (result.value) {
            let c = document.getElementById('txt-comment').value;
            callback(c);
        }
    });
}

export const swalLoading = () => {
    Swal.fire({
        title: 'Uploading...',
        text: "Please wait.",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}