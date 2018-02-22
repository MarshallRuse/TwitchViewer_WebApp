$(function(){
    var $allChannels = $("#allChannels");
    var $onlineChannels = $("#onlineChannels");
    var $offlineChannels = $("#offlineChannels");
  var $addBar = $("#addBar");
  var $addBtn = $("#addBtn");
    var onlineTemplate = $("#onlineTemplate").html();
    var offlineTemplate = $("#offlineTemplate").html();
  
    //Adapted from YouTube channel LearnCode.academy
		$(".tab-panels .tabs li").on("click", function(){
			//Used so that whole page isn't searched / so that the 
			//search doesnt interfere with other similar elements that
			//may be on the page
			var $panel = $(this).closest(".tab-panels");
			$panel.find(".tabs li.active").removeClass("active");
			$(this).addClass("active");
			//figure out which panel to show
			var panelToShow = $(this).attr('rel');
			
			//hide current panel
			$panel.find(".myPanel.active").slideUp(200, showNextPanel);

			function showNextPanel(){
				$(this).removeClass("active");
				//show new panel
				$("#"+panelToShow).slideDown(200, function(){
					$(this).addClass("active");
				});
			}
			

		}); //end tab-panels control
  
  function getAChannel(channelName){
    //just because I like having the base URL written somewhere
    var baseURLFCC = "https://wind-bow.gomix.me/twitch-api";
    var livestreamURL = baseURLFCC + "/streams/" + channelName;
    var normalURL = "https://twitch.tv/" + channelName;
    var channelInfo = {
      channel: channelName,
      channelURL: normalURL,
    }
    
    console.log(livestreamURL);
    $.ajax({
      type: "GET",
      url: livestreamURL,
      dataType: "jsonp",
      success: function(data){
        
        console.log(data);
        
        if (data.stream === null){
          $allChannels.append(Mustache.render(offlineTemplate, channelInfo));
          $offlineChannels.append(Mustache.render(offlineTemplate, channelInfo));
        }
        else{
          var channelPanelClass = data.stream.channel.display_name;
          
          channelInfo.game = data.stream.game;
          channelInfo.viewers = data.stream.viewers;
          channelInfo.panelChannel = channelPanelClass;
          $allChannels.append(Mustache.render(onlineTemplate, channelInfo));
         $onlineChannels.append(Mustache.render(onlineTemplate, channelInfo));
          
          $("."+channelPanelClass).css("background-image", "url('" + data.stream.channel.profile_banner + "')");
          
          
        }
      }
        
    });
    
  }//end getAChannel
  
  $addBtn.on("click", function(){
    var channel = $addBar.val();
    var baseURLFCC = "https://wind-bow.gomix.me/twitch-api";
    baseURLFCC += "/channels/" + channel;
    $.ajax({
      type: "GET",
      url: baseURLFCC,
      dataType: "jsonp",
      success: function(data){
        console.log("user search: " + data);
        if (data.status === 404){
          alert("ERROR: User does not exist");
        }
        else{
          getAChannel(channel);
        }
        
        
      },
      error: function(){
        alert("ERROR: User does not exist");
      }
    });
    
    
  });
  
  getAChannel("timthetatman");
  getAChannel("ESL_SC2");
  getAChannel("OGamingSC2");
  getAChannel("FreeCodeCamp");
	});