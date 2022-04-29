$(document).ready(function(){
    $.get("products.json", function(data){
        displayItems(data, '');
        $(".form-check-input").click(function(){
            var filters = $(".form-check-input:checked").map(function(){
                return $(this).val();
            }).get();
            displayItems(data, filters);
        });
    });
});



function displayItems(data, filters){
    $("#content").html("");
    for (const key in data){
        const item = data[key];
        if (item["prod_id"]){
            // filter-checking logic
            var prod_statuses = [];
            if (item["prod_status"]){
                prod_statuses = item["prod_status"].split(",");
            }
            if (filters.length > 0){
                const filtersMatch = filters.every(filter => prod_statuses.includes(filter));
                if (!filtersMatch){
                    continue;
                }
            }
            
            // add item card
            $("#content").append(
                '<div class="col mb-4 mb-sm-3 position-relative">\
                    <div class="card h-100 text-center">\
                        <div class="position-absolute top-0 w-100 d-flex justify-content-between p-2">\
                            <div>' + buildStatusBlocksHtml(item, prod_statuses) + '</div>' + 
                            buildSalePercentHtml(item) +
                        '</div>\
                        <img src="./placeholder.png" class="card-img-top" alt="...">\
                        <div class="card-body d-flex flex-column justify-content-between">\
                            <p class="card-title">' + item["prod_name"] + '</p>\
                            <div class="card-text itemPrices">\
                                <div class="namePriceSeparator"></div>' + 
                                buildPricesHtml(item) + 
                            '</div>\
                        </div>\
                    </div>\
                </div>');
        }
    }
}

function buildStatusBlocksHtml(item, prod_statuses){
    var translatedNames = {recommended:"Polecamy", 
                        saleout:"Wyprzedaż", 
                        bestseller:"Bestseller",
                        promotion:"Promocja",
                        new:"Nowość"};
    var statusBlocksHtml = "";
    if (prod_statuses.length > 0){
        for (let i = 0; i < prod_statuses.length; i++) {
            const element = prod_statuses[i];
            statusBlocksHtml = statusBlocksHtml.concat('<div class="statusBlock">' + translatedNames[element] +'</div>');
        }
    }
    return statusBlocksHtml;
}

function buildSalePercentHtml(item){
    // the data was a little confusing here, 
    // some items with the 'promotion' or 'saleout' tag did not have a "prod_oldprice" assigned to them
    // I'm not not sure whether prod_oldprice's existence is the right condition for the -% to be shown...
    // ...but that's what I went with!
    var salePercentHtml = "";
    if (item["prod_oldprice"]){
        var newPrice = item["prod_price"];
        var oldPrice = item["prod_oldprice"];
        //var percent = Math.floor(((newPrice - oldPrice) / newPrice) * 100);
        var percent = ((100 * (oldPrice - newPrice).toFixed(2)) / oldPrice);
        salePercentHtml = '<div class="d-flex salePercentage">-' + percent + '%</div>';
    }
    return salePercentHtml;
}


function buildPricesHtml(item){
    var pricesHtml = '<p class="currentPrice align-self-start">' + item["prod_price"].replace(".",",") + ' zł</p>';
    if (item["prod_oldprice"]){
        pricesHtml = pricesHtml.concat('<p class="oldPrice align-self-end">' + item["prod_oldprice"].replace(".",",") + ' zł</p>')
    }
    return pricesHtml;
}