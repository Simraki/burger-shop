function saveQty(id) {
    $(`#quant-${id}`).val($(`#quantity-${id}`).val())
}

function updateQty(id) {
    let numRegex = /^[0-9]+$'/
    const quant = $(`#quantity-${id}`).val()
    let hidden = $(`#quant-${id}`).val()

    if (quant.length > 0) {
        let qty = parseInt(quant)

//		if (numRegex.test(qty)) {
        if (qty > 0 && qty < 100) {

            const formData = {
                id: id,
                qty: quant,
            }

            $.ajax({
                url: '/user/update/cart',
                type: 'PUT',
                dataType: 'json',
                data: JSON.stringify(formData),
                success: function (status) {
                    if (status.success == true) {
                        $('#saved-cart-list').load(location.href + ' #saved-cart-list')
                        $('#cart-size').load(location.href + ' #cart-size')
                        $('#total-cost').load(location.href + ' #total-cost')
                        $('#tax-cost').load(location.href + ' #tax-cost')
                        $('#net-cost').load(location.href + ' #net-cost')
                    } else {
                        alert('Отпуск одного товара от 1 до 99')
                    }
                },
                contentType: 'application/json',
            })

        } else {
            alert('Отпуск одного товара от 1 до 99')
            $(`#quantity-${id}`).val(hidden)
        }
    } else {
        alert('Кол-во не может быть пустым')
        $(`#quantity-${id}`).val(hidden)
    }
}

function deleteCartItem(prod) {

    const data = {
        id: prod,
    }

    $.ajax({
        url: '/user/update/cart',
        type: 'DELETE',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (result) {
            $('#success-cart-list').removeClass('hidden')
            $('#saved-cart-list').load(location.href + ' #saved-cart-list')
            $('#cart-size').load(location.href + ' #cart-size')

            if (result.cartSize != 0) {
                $('#total-cost').load(location.href + ' #total-cost')
                $('#tax-cost').load(location.href + ' #tax-cost')
                $('#net-cost').load(location.href + ' #net-cost')
            } else {
                $('#summary').css('display', 'none')
            }

            setTimeout(() => {
                $('#success-cart-list').addClass('hidden')
            }, 6000)
        },
        contentType: 'application/json',
    })
}
