//
$(document).ready(function () {

    // click on user login form button
    $('#btn-user-login').on('click', function () {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const email = $('#email').val()
        const password = $('#password').val()
        const form = $('#form-user-login')
        console.log('asd')

        if (email.length > 0 && password.length > 0) {
            if (regex.test(email)) {

                const formData = {
                    email: email.toLowerCase(),
                    password: password,
                }

                console.log(formData)

                $.ajax({
                    url: '/user/login',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(formData),
                    success: function (data) {
                        $('#error-login').addClass('hidden')
                        $('#success-login').removeClass('hidden')

                        setTimeout(() => {
                            window.location.href = data.url
                        }, 600)
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        $('#success-login').addClass('hidden')
                        $('#error-login').removeClass('hidden')

                        console.log(xhr)

                        if (xhr.status === 404) {	// receiving 404 status code
                            $('#error-login-message').html('Этот Email не зарегистрирован')
                        } else { 	// receiving 400 status code
                            console.log('00000-')
                            $('#error-login-message').html('Неправильный пароль')
                        }
                    },
                    contentType: 'application/json',
                })

            } else {
                $('#success-login').addClass('hidden')
                $('#error-login').removeClass('hidden')
                $('#error-login-message').html('Неправильный Email')
            }
        } else {
            $('#success-login').addClass('hidden')
            $('#error-login').removeClass('hidden')
            $('#error-login-message').html('Поля не заполнены')
        }
    })

    // click on user login form button
    $('#btn-error-close').on('click', function () {
        $('#error-login').addClass('hidden')
    })

    // click on user login form button
    $('#btn-err-close').on('click', function () {
        $('#err-login').addClass('hidden')
    })

    // click on user forget form button
    $('#btn-user-forget').on('click', function () {
        window.location.href = '/user/forget-password'
    })

})
