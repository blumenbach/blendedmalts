		jQuery170(window).load(function ($) {	
					jQuery170.ajax({
                        	type: 'GET',
                                url: "/blumenbach/wisski/sites/all/themes/blendedmalts/scripts/checkTerms.php",
                                async:   false,
                                success: function(data){
									jQuery170('term').each(function(index) 
									{
										var jsonString = JSON.stringify(data);
										
										
										if (jsonString.indexOf(jQuery170(this).text()) > -1)
										{
												jQuery170(this).css('color','green').addClass('tooltip');
												jQuery170(this).css('font-weight','bold').addClass('tooltip');
												
										}
										else 
										{
										//var c = jQuery(this).children().attr( "ref" );
                                        if(jQuery(this).children().attr( "ref" ))
											{
											jQuery170(this).css('color', '#0000FF').addClass('tooltip');
											jQuery170(this).css('font-weight','bold').addClass('tooltip');
											} 
										}
									});
                                },
                                error:function(error){
                                	console.log('error from checkterms');
                                } 
                     });

			        jQuery170('persName').css('color','#CC9900').addClass('tooltip');
			        jQuery170('persName').css('font-weight','bold').addClass('tooltip');
					jQuery170('persName').css('padding-right','5px');
            		jQuery170('placeName').css('color','red').addClass('tooltip'); 
            		jQuery170('placeName').css('font-weight','bold').addClass('tooltip');

                    jQuery170.fn.ignore = function(sel){
                            return this.clone().find(sel).remove().end();
                    };
                    jQuery170('.tooltip').tooltipster({
                            content: 'Loading...',
                            contentAsHTML: true,
                            maxWidth:1050,
                            minWidth:400,
			                interactive:true,
                            functionBefore: function(origin, continueTooltip) {

                            // we'll make this function asynchronous and allow the tooltip to go ahead and show the loading notification while fetching our data
                            continueTooltip();   
        
                            // next, we want to check if our data has already been cached
                            if (origin.data('ajax') !== 'cached') {
                                    var pipeUrl = "";
                                    var tag = this.prop("tagName");
									var ifPersonOrPlace = 0;
                                    
                                    if(tag == "PERSNAME")
                                    {
                                        
                                        var cnp = jQuery170(this).attr('ref');
                                        //console.log(cnp);
                                        if (cnp.indexOf('#') == 0) {
											jQuery170(this).tooltipster('destroy');
                                            cnp = jQuery170(this).find('persname').attr('ref');
                                        }
                                        
                                        var n = cnp.lastIndexOf('/');
                                        var cnpNo = cnp.substring(n + 1);
                                        //console.log(cnpNo);
                                        pipeUrl= "https://query.wikidata.org/sparql?query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+wdt%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%0D%0APREFIX+wd%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Flabel+%3Fdesc+%3Fs+WHERE+%7B%0D%0A++%3Fs+wdt%3AP1871"+ cnpNo +"%0D%0A++%3Fs+rdfs%3Alabel+%3Flabel+filter%28lang%28%3Flabel%29+%3D+%22en%22%29+.%0D%0A++%3Fs+schema%3Adescription+%3Fdesc+filter%28lang%28%3Fdesc%29+%3D+%22en%22%29+%0D%0A%7D+";
										//curl https://query.wikidata.org/sparql?query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX+wdt%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%0APREFIX+wd%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%0A%0ASELECT+DISTINCT+%3Flabel+%3Fdesc+%3Fs+WHERE+%7B%0A++%3Fs+wdt%3AP1871+%22cnp01259920%22+.%0A++%3Fs+rdfs%3Alabel+%3Flabel+filter(lang(%3Flabel)+%3D+%22en%22)+.%0A++%3Fs+schema%3Adescription+%3Fdesc+filter(lang(%3Fdesc)+%3D+%22en%22)+%0A%7D+ -X GET -H 'Accept: application/sparql-results+json'
                                        ifPersonOrPlace = 1;

                                    }
                                    else if(tag == "PLACENAME")
                                    {
										var ref =jQuery170(this).attr("ref");
                                        var code = ref.substring(ref.lastIndexOf('/') + 1);
                                        pipeUrl = "http://vocab.getty.edu/sparql.json?query=PREFIX+gvp%3A+%3Chttp%3A%2F%2Fvocab.getty.edu%2Fontology%23%3E%0D%0APREFIX+dct%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+xl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2008%2F05%2Fskos-xl%23%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0ASELECT+%3Fname+%3FparentString+%3Fdescription%0D%0AWHERE+%7B%0D%0A++%3Fplace+dct%3Aidentifier+%22"+ code +"%22.%0D%0A++%3Fplace+xl%3AprefLabel+%3FnameLink.%0D%0A++%3FnameLink+xl%3AliteralForm+%3Fname.%0D%0A++%3Fplace+gvp%3AparentString+%3FparentString.%0D%0A++%3Fplace+skos%3AscopeNote+%3Fnote.%0D%0A++%3Fnote+rdf%3Avalue+%3Fdescription%0D%0A%7D&_implicit=false&implicit=true&_equivalent=false&_form=%2Fsparql";
										ifPersonOrPlace = 1;
										//console.log(nameLink);
                                    }
									else if(tag == "TERM")
                                    {
                                        ifPersonOrPlace = 0;
                                        var c = jQuery(this).children().attr( "ref" );
                                        if(c!=null)
                                        {
                                        var res = c.split(" ");
                                        var display = new Array();
										for (var i=0; i<res.length; i++)
											{
												res[i] = parseInt(res[i], 10);
												display+=  importVar(res[i]);
												display+= "<hr>";
											}			
											
                                        origin.tooltipster('content',display).data('ajax','cached');    
									    } 
									    else
									    {                                         
                                        jQuery170.ajax({
                                            type: 'GET',
                                            url: "/blumenbach/wisski/sites/all/themes/blendedmalts/scripts/fetchTermData.php?term=" + jQuery170(this).text(),
                                            dataType: 'json',
                                            success: function(data){
                                                if(data != null)
                                                {
                                                    if(data.count != 0)
                                                    {
                                                        var display = "<div><span STYLE='font-size: 12pt'> "+data.name+"</span><br/><span> "+data.description+"</span><span><a style='color:blue' target=_blank href=" + data.link + "><img src='/blumenbach/wisski/sites/all/themes/blendedmalts/scripts/external-link-16.png' align='right'></a></span></div>";
                                                        origin.tooltipster('content',display).data('ajax','cached'); 
                                                    }
                                                    else
                                                    {
                                                        origin.tooltipster('content', 'No data available for this TERM');
                                                    }
                                                }
                                                else
                                                {
                                                    origin.tooltipster('content', 'No data available for this TERM');
                                                }
                                            },
                                             error:function(error){
                                                console.log(error);
                                            }   
                                        } );
									   }
                                     }
                                    
                                    if(ifPersonOrPlace)
                                    {
										jQuery170.ajax({
											type: 'GET',
											url: pipeUrl,
                                            dataType: 'jsonp',
											//async:   false,
											success: function(data) {
												if(tag == "PERSNAME")
												{
													if(data.count != 0)
													{
													  var items = data.value.items;
													  var flag = true;
													  var langFlag = true;
													  jQuery170.each(items, function(index, value){
															 if(jQuery170(this.abstract).attr('xml:lang') == "de")
															 {
																flag = false;
																langFlag = false;
																var imgsrc = '<img src="' + items[index].thumbnail + '" height="90" width="70" align="right"/>';
																var display = "<div>" + imgsrc + "<span STYLE='font-size: 12pt'> "+items[index].title+"</span><br/><span> "+items[index].description+"</span></div>";                      
																origin.tooltipster('content',display).data('ajax','cached');
																return false;
															 }
													   });

                                                     if(flag)
														  {
															  var imgsrc = '<img src="' + items[index].thumbnail + '" height="90" width="70" align="right"/>';
															  var display = "<div>" + imgsrc + "<span STYLE='font-size: 12pt'> "+items[0].title+"</span><br/><span> "+items[0].description+"</span></div>";
															  origin.tooltipster('content',display).data('ajax','cached');
														  }			
												     if(langFlag)
														  {
															  origin.tooltipster('content', 'No Data Available');
														  }
                                                     }
												     else
													 {
														  origin.tooltipster('content', 'No GND Data Available/Yahoo Pipes Error');
													 }
												}
									else if(tag == "PLACENAME")
                                    {
										if(data.count != 0)
                                              {
                                                  var results = data.results.bindings;                                              
                                                  if(results.length > 0)
                                                  {
                                                      var flag = true;
                                                      var lang = results[0].description;
                                                      jQuery170.each(results, function(index, value){
                                                        if(jQuery170(this.description).attr('xml:lang') == "de")
                                                        {
                                                            flag = false;
                                                            var display = "<div><span STYLE='font-size: 12pt'> "+ utf8_decode(results[index].name.value)+" ("+  utf8_decode(results[index].parentString.value) +")</span><br/><span> "+ utf8_decode(results[index].description.value)+"</span></div>";
                                                            origin.tooltipster('content',display).data('ajax','cached');
                                                        }
                                                      });

                                                      if(flag)
                                                      
                                                      {
                                                          flag = true;
                                                          var display = "<div><span STYLE='font-size: 12pt'> "+ utf8_decode(results[0].name.value)+" ("+  utf8_decode(results[0].parentString.value) +")</span><br/><span> "+ utf8_decode(results[0].description.value)+"</span></div>";
                                                          origin.tooltipster('content',display).data('ajax','cached');
                                                      }
                                                  }
                                                  else
                                                  {
                                                      origin.tooltipster('content', 'No Data Available');
                                                  }
                                              }
                                              else
                                              {
                                                  origin.tooltipster('content', 'No Data Available');
                                              }   	
                                     }
									 }
                                    });
								}
                                }
                            }
                        });
                });
var importVar = function(key) {
		return $.data(document.body, key);
	};
