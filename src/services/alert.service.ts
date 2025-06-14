import Swal from "sweetalert2";

export class AlertService {
    static error(title: string, text: string) {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'I understand!',
            customClass: {
                popup: 'card',
                confirmButton: 'btn btn-primary',
                denyButton: 'btn btn-secondary',
                cancelButton: 'btn btn-primary'
            }
        })
    }

    static info(text: string) {
        return Swal.fire({
            icon: 'info',
            text: text,
            confirmButtonText: 'I understand!',
            customClass: {
                popup: 'card',
                confirmButton: 'btn btn-primary',
                denyButton: 'btn btn-secondary',
                cancelButton: 'btn btn-primary'
            }
        })
    }

    static question(title: string, text: string) {
        return Swal.fire({
            icon: 'question',
            title: title,
            text: text,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, please',
            cancelButtonText: "No, I don't",
            customClass: {
                popup: 'card',
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }
        })
    }
}