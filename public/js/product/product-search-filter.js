$(function () {

    $('.controlgroup').controlgroup()
    $('.controlgroup-vertical').controlgroup({
        'direction': 'vertical',
    })
})

function view(id) {
    window.location.href = `/product/id/${id}`
}

$(function () {
    let min
    let max
    let category

    $('.controlgroup-vertical input[name="category"]').change((e) => {
        category = e.target.value
        search()
    })

    $('#min-search-amount').focusout(() => {
        min = $('#min-search-amount').val()
        search()
    })
    $('#max-search-amount').focusout(() => {
        max = $('#max-search-amount').val()
        search()
    })

    function search() {
        let searchKey = $('#searched-value').val()

        if (min === 0) {
            min = '0'
        }
        if (max === 0) {
            max = '0'
        }
        if (category === 'all') {
            category = undefined
        }

        const formData = {
            search: searchKey,
            category: category,
            startRange: min,
            endRange: max,
        }

        $.ajax({
            url: '/product/search/filter',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(formData),
            success: function (data) {
                if (data.empty == false) {
                    let html = ''
                    for (let i = 0; i < data.product.length; i++) {

                        html += '' +
                            '<div class="panel panel-default item" onclick="window.location.href = ' + '\'/product/id/' + data.product[ i ]._id + '\'' + '" style="cursor: pointer">' +
                            '<div class="panel-heading" role="tab" id="profile-head">' +
                            '<h2 class="panel-title head">' +
                            data.product[ i ].title +
                            '</h2>' +
                            '</div>' +
                            '<div id="profile-panel" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="profile-head">' +
                            '<div class="panel-body">' +
                            '<div class="col-md-12">' +
                            '<div class="row">' +
                            '<img src="' + data.product[ i ].images[ 0 ] + '" alt="' + data.product[ i ].title + '" />' +
                            '</div>' +
                            '<div class="row detail">' +
                            '<div class="col-md-6 price">' +
                            data.product[ i ].price + ' ₽' +
                            '</div>' +
                            '<div class="col-md-6 weight">' +
                            data.product[ i ].weight +' гр' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                    }

                    $('#products-list').html(html)

                } else {
                    $('#products-list').html('<br/><br/><br/><br/><p>Ничего не найдено<p>')
                }
            },
            contentType: 'application/json',
        })
    }
})

function viewDetails(id) {
    window.location.href = `/product/category/${id}`
}
