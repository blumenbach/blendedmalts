( function () {
    'use strict';

    function getdbpURI(text) {
        return $.ajax({
            type: 'GET',
            url: "/blumenbach/wisski/sites/all/themes/blendedmalts/scripts/fetchTermData.php?term=" + text,
            async: false,
            success: function (data) {
                console.log(data);
                return data;
            }
        }).responseText;
    }

    function getGND(cnpNo) {
        return $.ajax({
            type: 'GET',
            url: "/blumenbach/wisski/sites/all/themes/blendedmalts/scripts/gndCerlConvertor.php?ID=" + cnpNo,
            async: false,
            success: function (data) {
                return data;
            }
        }).responseText;
    }

    function checkTerms() {
        return $.ajax({
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
    }

    function getPersonName(origin, pipeUrl, cerlUrl) {
        return $.ajax({
            type: 'GET',
            url: pipeUrl,
            headers: {
                'Accept': 'application/sparql-results+json'
            },
            dataType: 'json',
            success: function (data) {
                var results = data.results.bindings;
                    if (results.length > 0) {
                        $.each(results, function (index, value) {
                            var imgsrc = '<img src="' + results[0].image.value + '" height="90" width="70" align="right"/>';
                            var display = "<div>" + imgsrc + "<span STYLE='font-size: 12pt'> " + results[0].label.value + "</span><br/><span> " + results[0].desc.value + "</span></div>";
                            origin.tooltipster('content', display).data('ajax', 'cached');
                        });
                    } else {
                        getPersonDatafromCERL(origin, cerlUrl);
                    }
            }
        });
    }

    function getPersonDatafromCERL(origin, cerlUrl) {
            return $.ajax({
                type: 'GET',
                url: cerlUrl,
                dataType: 'xml',
                success: function (xml) {
                    $(xml).find("info").each(function(){
                        var name = $(this).find('display').text();
                        var biodata = $(this).find('biographicalData').text();
                        var activity = $(this).find('activityNote').text();
                        var display = '<table id="ttip_content">'
                                     + '<tr>'
                                     + '<td>'
                                     + '<table>'
                                     + '<tr><td>Name:</td><td>' + name + '</td></tr>'
                                     + '<tr><td>Biography:</td><td>' + biodata + '</td></tr>'
                                     + '<tr><td>Occupation:</td><td>' + activity + '</td></tr>';
                             display += '</table></td>';
                             display += '</tr>';
                             display += '</table>';
                        origin.tooltipster('content', display).data('ajax', 'cached');
                    });
                }
            });
    }

    function getPlaceName(origin, pipeUrl) {
        return $.ajax({
            type: 'GET',
            url: pipeUrl,
            dataType: 'json',
            success: function (data) {
                var results = data.results.bindings;
                var flag = true;
                if (results.length > 0) {
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
            }
        });
    }

    function getTerm(origin, wdqsUrl) {
        return $.ajax({
            type: 'GET',
            url: wdqsUrl,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                var results = data.results.bindings;
                var flag = true;
                if (results.length > 0) {
                    var lang = results[0].description;
                    $.each(results, function (index, value) {
                        var display = '<table id="ttip_content">'
                            + '<tr>'
                            + '<td>'
                            + '<table>'
                            + '<tr><td>Name:</td><td>' + results[index].label.value + '</td></tr>';
                        if (results[index].desc != undefined || results[index].desc != null) {
                            display += '<tr><td>Description:</td><td>' + results[index].desc.value + '</td></tr>';
                        }
                        if (results[index].taxon != undefined || results[index].taxon != null) {
                            display +=  '<tr><td>Taxon:</td><td>' + results[index].taxon.value + '</td></tr>';
                        }
                        display += '<tr><td>URI:</td><td><a href="' + results[index].o.value + '" target="_blank">' + results[index].o.value + '</a></td></tr>';
                        display += '</table></td>';
                        if (results[index].image != undefined || results[index].image != null) {
                            display += '<td><div style="width:125px;height:125px;"><img style="width:125px;height:auto;" src="' + results[index].image.value + '"/></div></td>';
                        }
                        display += '</tr>';
                        display += '</table>';
                        origin.tooltipster('content', display).data('ajax', 'cached');
                    });
                } else {
                    origin.tooltipster('content', 'No data available for this Term');
                }
            }
        });
    }

    function getObjects() {
        var importVar = function(key) {
            var value = $.data(document.body, key);
            return value[key];
        };
        var c = $(this).children().attr("ref");
        if (c != null) {
            var res = c.split(" ");
            var display = [];
            for (var i = 0; i < res.length; i++) {
                res[i] = parseInt(res[i], 10);
                var val = importVar(res[i]);
                if (!val) {
                    return;
                } else {
                    display += val;
                    display += "<hr>";
                }
            }
        }
        return display;
    }

    $().ready(function() {
        checkTerms();

        $('persName').css({'color':'#CC9900','font-weight':'bold','padding-right':'5px'}).addClass('tooltip');
        $('placeName').css({'color':'red', 'font-weight':'bold'}).addClass('tooltip');

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
                    if (tag == "PERSNAME") {
                        var cnp = $(this).attr('ref');
                        if (cnp.indexOf('#') == 0) {
                            $(this).tooltipster('destroy');
                            cnp = $(this).find('persname').attr('ref');
                        }

                        var cnpNo = cnp.substring(cnp.lastIndexOf('/') + 1);

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
                        var cerlUrl = 'http://sru.cerl.org/thesaurus?version=1.1&operation=searchRetrieve&query=ct.identifier=' + cnpNo;
                        getPersonName(origin, pipeUrl, cerlUrl);

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
                            '?place dct:identifier "' + code + '" .' +
                            '?place xl:prefLabel ?nameLink .' +
                            '?nameLink xl:literalForm ?name .' +
                            '?place gvp:parentString ?parentString.' +
                            'OPTIONAL {?place skos:scopeNote ?note .' +
                            '?note rdf:value ?description}}').replace(/\(/g, "%28").replace(/\)/g, "%29");

                        var TGNParams = '&_implicit=false&implicit=true&_equivalent=false&_form=/sparql';
                        pipeUrl = SERVICE + '?query=' + query + TGNParams;

                        getPlaceName(origin, pipeUrl);

                    } else if (tag == "TERM") {
                        var objects = getObjects();
                        if (objects) {
                            origin.tooltipster('content', display).data('ajax', 'cached');
                        }
                        var text = $(this).text();
                        var record = $.parseJSON(getdbpURI(text)) || 0;
                        var resource = record["link"];
                        if (record != 0) {
                            var wpid = encodeURIComponent(resource.substring(resource.lastIndexOf('/') + 1));
                            var wpuri = '<https://de.wikipedia.org/wiki/' + wpid + '>';
                            var SERVICE_WD = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';
                            var wdquery = encodeURIComponent('PREFIX schema: <http://schema.org/>' +
                                'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
                                'PREFIX wdt: <http://www.wikidata.org/prop/direct/>' +
                                'PREFIX wd: <http://www.wikidata.org/entity/>' +
                                'SELECT ?o ?label ?desc ?image ?taxon WHERE { ' +
                                wpuri + ' schema:about ?o .' +
                                '?o rdfs:label ?label filter(lang(?label) = "de") .' +
                                'OPTIONAL {?o schema:description ?desc filter(lang(?desc) = "en")} .' +
                                'OPTIONAL {?o wdt:P225 ?taxon} .' +
                                'OPTIONAL {?o wdt:P18 ?image}}').replace(/\(/g, "%28").replace(/\)/g, "%29");

                            var wdqsUrl = SERVICE_WD + '?query=' + wdquery;
                        } else {
                            wdqsUrl = null;
                        }

                        if (wdqsUrl) {
                           getTerm(origin, wdqsUrl) ;
                        } else {
                            origin.tooltipster('content', 'No data available for this Term');
                        }
                    }
                }
            }
        });
    });
}() );
