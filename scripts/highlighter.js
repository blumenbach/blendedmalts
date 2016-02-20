(function() {

$().ready(function() {	
    $.ajax({
        type: 'GET',
            url: "/blumenbach/wisski/sites/all/themes/blendedmalts/scripts/checkTerms.php",
            async:   false,
            success: function(data){
                $('term').each(function(index) {
                    var jsonString = JSON.stringify(data);


                    if (jsonString.indexOf($(this).text()) > -1) {
                            $(this).css('color','green').addClass('tooltip');
                            $(this).css('font-weight','bold').addClass('tooltip');
                    } else {
                    //var c = jQuery(this).children().attr( "ref" );
                        if(jQuery(this).children().attr( "ref" )) {
                            $(this).css('color', '#0000FF').addClass('tooltip');
                            $(this).css('font-weight','bold').addClass('tooltip');
                        }
                    }
                });
            },
            error:function(error){
                console.log('error from checkterms');
            }
     });

    $('persName').css('color','#CC9900').addClass('tooltip');
    $('persName').css('font-weight','bold').addClass('tooltip');
    $('persName').css('padding-right','5px');
    $('placeName').css('color','red').addClass('tooltip'); 
    $('placeName').css('font-weight','bold').addClass('tooltip');

    $.fn.ignore = function(sel){
            return this.clone().find(sel).remove().end();
    };

    $('.tooltip').tooltipster({
        content: 'Loading...',
	theme: 'tooltipster-light',
        contentAsHTML: true,
        maxWidth: 1050,
        minWidth: 400,
        interactive: true,
        functionBefore: function (origin, continueTooltip) {
            continueTooltip();

            if (origin.data('ajax') !== 'cached') {
                var pipeUrl = "";
                var tag = this.prop("tagName");
                var ifPersonOrPlace = 0;

                if (tag == "PERSNAME") {
                    var cnp = $(this).attr('ref');
                    if (cnp.indexOf('#') == 0) {
                        $(this).tooltipster('destroy');
                        cnp = $(this).find('persname').attr('ref');
                    }

                    var cnpNo = cnp.substring(cnp.lastIndexOf('/') + 1);

                    function getGND(cnpNo) {  
                        return $.ajax({
                            type: 'GET',
                            url: "/blumenbach/wisski/sites/all/themes/blendedmalts/scripts/gndCerlConvertor.php?ID=" + cnpNo,
                            async:   false,
                            success: function(data){
                            return data;
                            }
                        }).responseText;
                    }

                    var GND = getGND(cnpNo) || 0;
                    var SERVICE = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';
                    var query = encodeURIComponent('PREFIX schema: <http://schema.org/>' +
                        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
                        'PREFIX wdt: <http://www.wikidata.org/prop/direct/>' +
                        'PREFIX wd: <http://www.wikidata.org/entity/>' +
                        'SELECT DISTINCT ?label ?desc ?s ?image WHERE { ' +
                        '?s wdt:P227 "' + GND + '" .' +
			            '?s wdt:P18 ?image .' +
                        '?s rdfs:label ?label filter(lang(?label) = "en") .' +
                        '?s schema:description ?desc filter(lang(?desc) = "en")}').replace(/\(/g, "%28").replace(/\)/g, "%29");
                    pipeUrl = SERVICE + '?query=' + query;

                    $.ajax({
                        type: 'GET',
                        url: pipeUrl,
                        headers: {
                            'Accept': 'application/sparql-results+json'
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.count != 0) {
                                var results = data.results.bindings;
                                if (results.length > 0) {
                                    var flag = true;
                                    var langFlag = true;
                                    $.each(results, function (index, value) {
                                            flag = false;
                                            var imgsrc = '<img src="' + results[0].image.value + '" height="90" width="70" align="right"/>';
                                            var display = "<div>" + imgsrc + "<span STYLE='font-size: 12pt'> " + results[0].label.value + "</span><br/><span> " + results[0].desc.value + "</span></div>";
                                            origin.tooltipster('content', display).data('ajax', 'cached');
                                            return false;
                                    });

                                    if (flag) {
                                        var imgsrc = '<img src="' + results[0].image.value + '" height="90" width="70" align="right"/>';
                                        var display = "<div>" + imgsrc + "<span STYLE='font-size: 12pt'> " + results[0].label.value + "</span><br/><span> " + results[0].desc.value + "</span></div>";
                                        origin.tooltipster('content', display).data('ajax', 'cached');
                                    }
                                } else {
                                    origin.tooltipster('content', 'No Data Available');
                                }
                            }
                        }
                    });
                } else if (tag == "PLACENAME") {
                    var ref = $(this).attr("ref");
                    var code = ref.substring(ref.lastIndexOf('/') + 1);
                    SERVICE = 'http://vocab.getty.edu/sparql.json';
                    query = encodeURIComponent('PREFIX gvp: <http://vocab.getty.edu/ontology#>' +
                        'PREFIX dct: <http://purl.org/dc/elements/1.1/>' +
                        'PREFIX xl: <http://www.w3.org/2008/05/skos-xl#>' +
                        'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>' +
                        'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' +
                        'SELECT ?name ?parentString ?description WHERE {' +
                        '?place dct:identifier "' +  code + '" .' +
                        '?place xl:prefLabel ?nameLink .' +
                        '?nameLink xl:literalForm ?name .' +
                        '?place gvp:parentString ?parentString.' +
                        'OPTIONAL {?place skos:scopeNote ?note .' +
                        '?note rdf:value ?description}}').replace(/\(/g, "%28").replace(/\)/g, "%29");

                    var TGNParams =    '&_implicit=false&implicit=true&_equivalent=false&_form=/sparql';
                    pipeUrl = SERVICE + '?query=' + query + TGNParams;
                    //pipeUrl ="http://vocab.getty.edu/sparql.json?query=PREFIX+gvp%3A+%3Chttp%3A%2F%2Fvocab.getty.edu%2Fontology%23%3E%0D%0APREFIX+dct%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+xl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2008%2F05%2Fskos-xl%23%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0ASELECT+%3Fname+%3FparentString+%3Fdescription%0D%0AWHERE+%7B%0D%0A++%3Fplace+dct%3Aidentifier+%22" + code + "%22.%0D%0A++%3Fplace+xl%3AprefLabel+%3FnameLink.%0D%0A++%3FnameLink+xl%3AliteralForm+%3Fname.%0D%0A++%3Fplace+gvp%3AparentString+%3FparentString.%0D%0A++++OPTIONAL+%7B%3Fplace+skos%3AscopeNote+%3Fnote.%0D%0A%09%3Fnote+rdf%3Avalue+%3Fdescription%7D.++++%0D%0A%7D&_implicit=false&implicit=true&_equivalent=false&_form=%2Fsparql"
                    $.ajax({
                        type: 'GET',
                        url: pipeUrl,
                        dataType: 'json',
                        //async:   false,
                        success: function (data) {
                            if (data.count != 0) {
                                var results = data.results.bindings;
                                var flag = true;
                                if (results.length > 0) {
                                    var lang = results[0].description;
                                    $.each(results, function (index, value) {
                                        if ($(this.description).attr('xml:lang') == "de") {
                                            flag = false;
                                            var label = "<div class='form-item'><label>Label</label><ul><li> " + utf8_decode(results[index].name.value) + "</li></ul></div>";
                                            var parentString = "<div class='form-item'><label>Parent</label><ul><li> (" + utf8_decode(results[index].parentString.value) + ")</li></ul></div>";
                                            var description = "<div class='form-item'><label>Description</label><ul><li> " + utf8_decode(results[index].description.value) + "</li></ul></div>";
                                            var display = "<div class='wisski_vocab_ctrl_infobox'>" + label + parentString + description + "</div>";
                                            origin.tooltipster('content', display).data('ajax', 'cached');

                                        }
                                    });

                                    if (flag) {
                                        flag = true;
                                        $.each(results, function (index, value) {
                                        var display;
                                            var label = "<div class='form-item'><label>Label</label><ul><li> " + utf8_decode(results[index].name.value) + "</li></ul></div>";
                                                                    var parentString = "<div class='form-item'><label>Parent</label><ul><li> (" + utf8_decode(results[index].parentString.value) + ")</li></ul></div>"
                                            if (results[0].description) {
                                                                        var description = "<div class='form-item'><label>Description</label><ul><li> " + utf8_decode(results[index].description.value) + "</li></ul></div>";
                                            } else {
                                            description = ""
                                            }
                                        display = "<div class='wisski_vocab_ctrl_infobox'>" + label + parentString + description + "</div>"
                                        origin.tooltipster('content', display).data('ajax', 'cached');
                                        });
                                    } else {
                                        origin.tooltipster('content', 'No Data Available');
                                    }
                                } else {
                                origin.tooltipster('content', 'No Data Available');
                                }
                            }
                        }
                    });
                } else if (tag == "TERM") {
                    var c = $(this).children().attr("ref");
                    function getdbpURI(text) {
                        return $.ajax({
                            type: 'GET',
                            url: "/blumenbach/wisski/sites/all/themes/blendedmalts/scripts/fetchTermData.php?term=" + text,
                            async:   false,
                            success: function(data){
				console.log(data);
                                return data;
                            }
                        }).responseText;
                    }
		    var text = $(this).text();	
                    var record = $.parseJSON(getdbpURI(text)) || 0;
		    var resource = record["link"];
                    if (record != 0) {
			var wpid = encodeURIComponent(resource.substring(resource.lastIndexOf('/') + 1));
	               	var wpuri = '<https://de.wikipedia.org/wiki/' + wpid + '>';
		        var ref = resource.indexOf('de');
		    } else {
		      ref = 0
		    }	
                    SERVICE = 'http://de.dbpedia.org/sparql';
		    SERVICE_EN = 'http://dbpedia.org/sparql';	
		    SERVICE_WD = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';

                    query = encodeURIComponent('PREFIX dbo: <http://dbpedia.org/ontology/>' +
                        'SELECT ?s ?label ?abstract ?image WHERE {' +
                        '?s rdfs:label ?label .' +
                        '?s dbo:abstract ?abstract .' +
                        'OPTIONAL {?s dbo:thumbnail ?image} .' +
                        'VALUES ?s {<' + resource + '>}}').replace(/\(/g, "%28").replace(/\)/g, "%29");
		    
                    var wdquery = encodeURIComponent('PREFIX schema: <http://schema.org/>' +
                        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
                        'PREFIX wdt: <http://www.wikidata.org/prop/direct/>' +
                        'PREFIX wd: <http://www.wikidata.org/entity/>' +
                        'SELECT ?o ?label ?desc ?image WHERE { ' +
                         wpuri + ' schema:about ?o .' +
                        '?o rdfs:label ?label filter(lang(?label) = "de") .' +
                        '?o schema:description ?desc filter(lang(?desc) = "en") .' +
                        'OPTIONAL {?o wdt:P18 ?image}}').replace(/\(/g, "%28").replace(/\)/g, "%29");

		    if (ref > 0) {
		    	pipeUrl = SERVICE + '?query=' + query;
		    } else {
		    	pipeUrl = SERVICE_EN + '?query=' + query;
		    }
                    var wdqsUrl = SERVICE_WD + '?query=' + wdquery;

		    if (c != null) {
                        var res = c.split(" ");
                        var display = [];
                        for (var i = 0; i < res.length; i++) {
                            res[i] = parseInt(res[i], 10);
                            display += importVar(res[i]);
                            display += "<hr>";
                        }

                        origin.tooltipster('content', display).data('ajax', 'cached');
                    } else {
                        $.ajax({
                            type: 'GET',
                            url: pipeUrl,
                            dataType: 'json',
                            success: function (data) {
				            console.log(data);
                                if (data.count != 0) {
                                    var results = data.results.bindings;
                                    var flag = true;
                                    if (results.length > 0) {
                                        var lang = results[0].description;
                                        $.each(results, function (index, value) {
                                            var display = '<table id="ttip_content">'
                                                + '<tr>'
                                                + '<td>'
                                                + '<table>'
                                                + '<tr><td>Name:</td><td>' + results[index].label.value + '</td></tr>'
						+ '<tr><td>Abstract:</td><td>' + results[index].abstract.value + '</td></tr>';
                                            display += '<tr><td>URI:</td><td><a href="' + results[index].s.value + '" target="_blank">' + results[index].s.value + '</a></td></tr>';
                                            display += '</table></td>';
                                            if (results[index].image != undefined || results[index].image != null) {
                                                display += '<td><div style="width:125px;height:125px;"><img style="width:125px;height:auto;" src="' + results[index].image.value + '"/></div></td>';
                                            }
                                            display += '</tr>';
                                            display += '</table>';
					 origin.tooltipster('content', display).data('ajax', 'cached');
                                        });
                                    }
				}
			   }	
			});
			}
			if (!display) {
				 $.ajax({
                            		type: 'GET',
                            		url: wdqsUrl,
                            		dataType: 'json',
                            		success: function (data) {
                                            console.log(data);
                                	if (data.count != 0) {
                                    		var results = data.results.bindings;
                                    		var flag = true;
                                    		if (results.length > 0) {
                                        		var lang = results[0].description;
                                        		$.each(results, function (index, value) {
                                            		var display = '<table id="ttip_content">'
                                                	+ '<tr>'
                                                	+ '<td>'
                                                	+ '<table>'
                                                	+ '<tr><td>Name:</td><td>' + results[index].label.value + '</td></tr>'
                                                	+ '<tr><td>Abstract:</td><td>' + results[index].desc.value + '</td></tr>';
                                            		display += '<tr><td>URI:</td><td><a href="' + results[index].o.value + '" target="_blank">' + results[index].o.value + '</a></td></tr>';
                                            		display += '</table></td>';
                                            		if (results[index].image != undefined || results[index].image != null) {
                                                		display += '<td><div style="width:125px;height:125px;"><img style="width:125px;height:auto;" src="' + results[index].image.value + '"/></div></td>';
                                            		}
                                            		display += '</tr>';
                                            		display += '</table>';
                                 	        origin.tooltipster('content', display).data('ajax', 'cached');
                            		            	});
						 }
					}
					}	
                                    });
                        } else {
                                    origin.tooltipster('content', 'No data available for this TERM');
                        }
                }
            }
        }
    });
});
var importVar = function(key) {
		var value = $.data(document.body, key);
		return value[key];
	};
})();
