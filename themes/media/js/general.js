//var j = 'jQuery';
jQuery(document).ready(function(){
	if(typeof window.rating == 'function') {
	    jQuery('.star').rating();
    	jQuery('.star').rating('readOnly');
	}

    /**
     * album jq
     */

    //message box manipulation for various events
    // Upload tab - album selection

    jQuery('#rt-album-choice-existing').live('click',function(){
		jQuery('#rt-selected-album').fadeIn('slow');    
        jQuery('#rt-create-album').fadeOut('slow'); 
        jQuery('#kaltura_contribution_wizard_wrapper').css("display","block");
        jQuery('.rt-album-message p').remove();
        jQuery('.rt-album-message').append('<p>Select Album before Uploading media</p>');
    });
    jQuery('#rt-album-choice-new').live('click',function(){
		jQuery('#rt-selected-album').fadeOut('slow');    
        jQuery('#rt-create-album').fadeIn('slow'); 
        jQuery('#kaltura_contribution_wizard_wrapper').css("display","none");
        jQuery('.rt-album-message p').remove();
        jQuery('.rt-album-message').append('<p>Create Album to Upload Media</p>');

    });

    //when go button clicked on album creation
    jQuery('#rt-create-album-button').live('click',function(){
        //this adds a new message to the green message bar
        var visibility='';
        var new_album_name = '';
        new_album_name = jQuery('#rt-new-album-name').val();
        if(new_album_name == ''){ //if album name is keppt blank
            jQuery('.rt-album-message p').remove();
            jQuery('.rt-album-message').append('<p>Album Name Blank!</p>');
            return false;
        }else{//do nothing
            
        }

        visibility = jQuery('#rt-create-album input:radio:checked').val();
        var data = {
            action: 'create_new_album',
            new_album_name : new_album_name,
            visibility : visibility
        };

        jQuery.post(ajaxurl, data, function(response) {
            response1 = response;
            var test = response.split('@#@')
            if(test[0] == 'nops'){//if album exist then do not create
                jQuery('.rt-album-message p').remove();
                jQuery('.rt-album-message').append('<p>Album Name already exist. Please try another name!</p>');
            //                jQuery('.rt-album-message p').text('Album Name already exist. Please try another name');
            }
            else{ //send success message as well as display embeded KCW
                
                jQuery('.rt-album-message p').remove();
                jQuery('.rt-album-message').append('<p>Album Created. Upload Media</p>');
                jQuery('#kaltura_contribution_wizard_wrapper').css("display","block");
            }
        });
    });


    //jquery for album in upload tab. (only available under media tab and not in group)
    jQuery('#rt-album-list-ul li').live('click',function(){
        album_name = this.innerHTML;
        //album name is added as a class to the album thumb images so that its easy to show hide.
        //only "this" album name will be shown and all others are kept hidden
        //Most funny code I have ever written in jquery :D Enjoyed this a lot!
        var data = {
            action: 'rt_fetch_images_for_album',
            album_name : album_name
        };

        jQuery.post(ajaxurl, data, function(response) {
            jQuery('#rt-pics-list li').remove();
            jQuery('#rt-pics-list').append(response);
//        jQuery('#rt-pics-list li').each(function(index) {
//              if(jQuery(this).is('.'+album_name)){
//                    jQuery(this).removeAttr('display');
//                    jQuery(this).removeAttr('style');
//                    jQuery(this).attr('display','inline');
//              }else{
//                  jQuery(this).hide();
//              }
//        });

        });

        //this with come in respose.
    });

    //filter for album drop down : kapil
        jQuery('#media-order-select select option').live('click',function(){
//            alert('hello');
//                console.log(jQuery(this).val());
                if(jQuery(this).val() == 'my-media-data'){
                    //hide other's album from drop down'
                    jQuery('#media-sort-album-select select option.rt-others-album').hide();
                }
                else if(jQuery(this).val() == 'all-media-data'){
                    //show all album in the drop down
                    jQuery('#media-sort-album-select select option.rt-others-album').show();
                }
                else if(jQuery(this).val() == 'recent-media-data'){
                    //show all album in the drop down
                    jQuery('#media-sort-album-select select option.rt-others-album').show();
                }
                else if(jQuery(this).val() == 'commented-media-data'){
                    //show all album in the drop down
                    jQuery('#media-sort-album-select select option.rt-others-album').show();
                }
                else if(jQuery(this).val() == 'top-rated-media-data'){
                    //show all album in the drop down
                    jQuery('#media-sort-album-select select option.rt-others-album').show();
                }
        });

//START OF FUNCTION FOR DELETING ABUSE LIST

        jQuery('a.ignore').click(function(){
           jQuery(this).addClass('loading');
           var ignID = jQuery(this).parent('td').attr('id');
           var ignID_tr = jQuery(this).parent('td').parent('tr').attr('id');
           var temp = ignID.split("-");
           var id = temp[1];
           //codde for ajax call here
           var data = {action: 'undo_media_abuse',image_id: id};
            jQuery.post(ajaxurl, data, function(response) {
                        if(response == '1'){
                                jQuery('#'+ignID_tr).slideUp(300,function(){
                                    jQuery(this).remove();
                                });
                        }
                        else
                            alert('error in deleting');
                });

        });//END OF FUNCTION FOR DELETING ABUSE LIST
        
//        jQuery('#datepicker').datepicker({ changeMonth: true,changeYear: true});



//this is for "bp-media-admin-reassign" page where ui sorting plugin is added
	jQuery(function() {
		jQuery("#rt-contentLeft-photo ul").sortable({opacity: 0.6, cursor: 'move', update: function() {
                        var new_sequence = jQuery(this).sortable("serialize");
                        //admin ajax with jquery
			var data = {action: 'updateRecordsListings_photo' , new_sequence : new_sequence} ;

			jQuery.post(ajaxurl, data, function(theResponse){

                                // TODO : Message is shown directly without any validation
                                jQuery("#rt-contentRight-photo").show();
//                                jQuery("#rt-contentRight-photo").fadein('slow');
				jQuery("#rt-contentRight-photo").html('Photo Sequence Updated!');
//				jQuery("#contentRight").html(theResponse);
			});
		}
		});
	});
	jQuery(function() {
		jQuery("#rt-contentLeft-video ul").sortable({opacity: 0.6, cursor: 'move', update: function() {

                        var new_sequence = jQuery(this).sortable("serialize");
                        //admin ajax with jquery
			var data = {action: 'updateRecordsListings_video' , new_sequence : new_sequence} ;

			jQuery.post(ajaxurl, data, function(theResponse){
                                // TODO : Message is shown directly without any validation
				jQuery("#rt-contentRight-video").show();
//                                jQuery("#rt-contentRight-video").fadein('slow');
				jQuery("#rt-contentRight-video").html('Video Sequence Updated!');
//				jQuery("#contentRight").html(theResponse);
			});
		}
		});
	});

        // Called explicitely on document.ready()
        setClickable_title();

        // This is for inline editing on admin side Dashboard submenu - Prasad.
        function setClickable_title() {
            jQuery('.column-owner p').click(function() {
            var inputtext = '<div><input value="'+jQuery.trim(jQuery(this).html())+'" />';
            var button = '<div><input type="button" value="SAVE" class="saveButton" /> OR <input type="button" value="CANCEL" class="cancelButton" /></div></div>';
            var revert = jQuery(this).html();
            var refObj = this;

            jQuery(this).after(inputtext+button).remove();
            jQuery('.saveButton').click(function(){saveChanges_title(refObj, this, false);});
            jQuery('.cancelButton').click(function(){saveChanges_title(refObj, this, revert);});
            })
            .mouseover(function() {
            jQuery(this).addClass("editable");
            })
            .mouseout(function() {
            jQuery(this).removeClass("editable");
            });
        }

        function saveChanges_title(refObj, obj, cancel) {
            if(!cancel) {
            jQuery('.column-owner').addClass('m-loading');
            var t = jQuery(obj).parent().siblings(0).val();
            var new_title = jQuery(obj).parent().siblings(0).val();
                    var divId = jQuery(refObj).attr('id');
                    var id = divId.split('_')['1'];
                    var data = {action: 'media_change_title','id': id,new_title: new_title};
                    var newt = '<p>'+new_title+'</p>';
                    jQuery(obj).parent().parent().parent().html(newt);
                    jQuery.post(ajaxurl,data,function(txt){
                        jQuery('#user-title h2 p' ).text(txt);
                        jQuery('#user-title').removeClass('m-loading');
                    });
            }
            else {
            var t = cancel;
            }
            if(t=='') t='(click to add text)';
            jQuery(obj).parent().parent().parent().after('<h2 class = "rt-mediatitle"  title ="Click here to add title"><p>'+t+'</p></h2>').remove();
            setClickable_title();
        }


});