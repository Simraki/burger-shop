//
$(document).ready(function () {

    // click on user login form button
    $('#btn-user-forget').on('click', function () {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const email = $('#email').val()
        const form = $('#form-user-forget')

        if (email.length) {
            if (regex.test(email)) {

                const formData = {
                    email: email,
                }

                $.ajax({
                    url: '/user/forget-password',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(formData),
                    success: function (data) {
                        $('#error-forget').addClass('hidden')
                        $('#success-forget').removeClass('hidden')
                        $('#email').val('')
                        alert('Новый пароль для \'' + data.email + '\' это ' + data.password)
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        $('#success-forget').addClass('hidden')
                        $('#error-forget').removeClass('hidden')

                        if (xhr.status === 404) {	// receiving 404 status code
                            $('#error-forget-message').html('Этот Email не зарегистрирован')
                        } else { 	// receiving 400 status code
                            $('#error-forget-message').html('Неправильный пароль')
                        }
                    },
                    contentType: 'application/json',
                })

            } else {
                $('#success-forget').addClass('hidden')
                $('#error-forget').removeClass('hidden')
                $('#error-forget-message').html('Неправильный Email')
            }
        } else {
            $('#success-forget').addClass('hidden')
            $('#error-forget').removeClass('hidden')
            $('#error-forget-message').html('Поле не заполнено')
        }
    })

    // click on user forget form button
    $('#btn-error-close').on('click', function () {
        $('#error-forget').addClass('hidden')
    })

    // click on user login form button
    $('#btn-err-close').on('click', function () {
        $('#err-forget').addClass('hidden')
    })

    // click on user login form button
    $('#btn-user-login').on('click', function () {
        window.location.href = '/user/login'
    })

})
