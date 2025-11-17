(function(){
    var script = {
 "scripts": {
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "existsKey": function(key){  return key in window; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "unregisterKey": function(key){  delete window[key]; },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "getKey": function(key){  return window[key]; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "registerKey": function(key, value){  window[key] = value; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; }
 },
 "children": [
  "this.MainViewer"
 ],
 "id": "rootPlayer",
 "defaultVRPointer": "laser",
 "start": "this.init()",
 "horizontalAlign": "left",
 "downloadEnabled": false,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "width": "100%",
 "borderRadius": 0,
 "overflow": "visible",
 "verticalAlign": "top",
 "minHeight": 20,
 "layout": "absolute",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minWidth": 20,
 "scrollBarOpacity": 0.5,
 "desktopMipmappingEnabled": false,
 "height": "100%",
 "scrollBarMargin": 2,
 "definitions": [{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 120.71,
   "distance": 1,
   "backwardYaw": -86.8,
   "panorama": "this.panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 7.37,
   "distance": 1,
   "backwardYaw": -161.06,
   "panorama": "this.panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193"
  }
 ],
 "label": "VR LOKET - 3",
 "id": "panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_61C3CCA8_70F6_5B42_41D8_FC4084EACB2E",
  "this.overlay_60096C8B_70F6_3B46_41D7_353E5E45E560"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 49.36,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30518E84_70BD_D742_41C3_56587FDCB793",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -77.12,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_321E00B1_70BD_CB42_41D0_2FC82E3100C7",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -173.85,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_33DA7F2C_70BD_D543_41D9_ABFD11244149",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.2,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_306DDE4D_70BD_D7C2_41CD_D6EFB18E5D1E",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 13.06,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30087E25_70BD_D742_41D5_DE4A309F33D5",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 9.04,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_33CABF1C_70BD_D542_41D2_E01E27BE1FFC",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 164.05,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_31F33C5E_70BD_DBFE_41DC_46691B07C3A4",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 61.05,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3028CE02_70BD_D746_41C6_FD110B30CEDB",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -6.73,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_33F44EF5_70BD_D4C2_41D5_4C50E1454CEC",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -56.78,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_35A240EA_70BD_CCC7_4191_9899893FB08B",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 65.44,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_32CAC056_70BD_CBCE_41DB_88A8134F8A21",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -110.1,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3596810C_70BD_CD42_41BB_221A7ED60724",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -16.2,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3073FE63_70BD_D7C5_41D6_89AD2D634DC8",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 23.87,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_33A14E99_70BD_D742_41CF_B0CBD14BFED2",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -91.19,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_32E56020_70BD_CB43_41B9_D0B161A2BD56",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -178.37,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3508D163_70BD_CDC5_41D5_5B0E23081B83",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4"
  }
 ],
 "label": "VR ENTRANCE - 3",
 "id": "panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_51F4A862_708A_5BC7_41D3_70CDD62544B3"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -31.78,
   "distance": 1,
   "backwardYaw": 141.45,
   "panorama": "this.panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 148.09,
   "distance": 1,
   "backwardYaw": 31.53,
   "panorama": "this.panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9"
  }
 ],
 "label": "VR DINORANCH - 12",
 "id": "panorama_6E81D499_709D_CB42_419F_6987EF427CA1",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_5DFE1C90_718A_FB42_41B5_AED425EDF7A2",
  "this.overlay_5FDDCF67_718A_35CE_41D2_0AE08592C989"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -133.4,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_33383F53_70BD_D5C6_41AB_440B819F8B2A",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6E81D499_709D_CB42_419F_6987EF427CA1_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -175.6,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3153ED44_70BD_D5C2_41B9_0788D610DBCF",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -125.36,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3124ECAD_70BD_DB42_41C2_D5F6596521F3",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -150.23,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3228907B_70BD_CBC6_41BA_1CC337D81F42",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 148.22,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_33C41F06_70BD_D54F_41DB_0E4E480C10B5",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 18.94,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_352AE14E_70BD_CDDE_41DB_D339246DC79B",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 5.75,
   "distance": 1,
   "backwardYaw": 136.99,
   "panorama": "this.panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -139.93,
   "distance": 1,
   "backwardYaw": 69.9,
   "panorama": "this.panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93"
  }
 ],
 "label": "VR LOKET - 21",
 "id": "panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_6F4C5092_708A_4B46_41AF_4049D9FB9201",
  "this.overlay_6D7052E4_708B_CCC2_41D0_C1A632E9E274"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -24.12,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_326CE0BE_70BD_CCBE_41B0_8498CC39946F",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 26.05,
   "distance": 1,
   "backwardYaw": 155.88,
   "panorama": "this.panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758"
  }
 ],
 "label": "VR DINORANCH - 1",
 "id": "panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_536363E4_7175_CCC2_41D8_12492C87E5A1",
  "this.overlay_532C387C_7176_3BC2_41C9_61D8345F30F8"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 155.88,
   "distance": 1,
   "backwardYaw": 26.05,
   "panorama": "this.panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -40.82,
   "distance": 1,
   "backwardYaw": -123.94,
   "panorama": "this.panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D"
  }
 ],
 "label": "VR DINORANCH - 2",
 "id": "panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_53AE9FFF_717A_F4BE_41BD_1CBD09C7529F",
  "this.overlay_5387DDD9_7176_54C5_41B2_456302F13002"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -166.94,
   "distance": 1,
   "backwardYaw": -161.16,
   "panorama": "this.panorama_6341E851_7097_DBC2_41B8_00401AC84CD8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 6.66,
   "distance": 1,
   "backwardYaw": -158.9,
   "panorama": "this.panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286"
  }
 ],
 "label": "VR LOKET - 15",
 "id": "panorama_63A7101A_7097_CB46_41D7_223F644A8390",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_68BEC6F0_7096_34C2_418F_7F8125B1B1DE",
  "this.overlay_68313E58_708A_F7C2_41DA_C3D1F5953EF8"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -154,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3242E0D5_70BD_CCC2_41D7_D9273AEBFC66",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "label": "VR TAMAN - 2",
 "id": "panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "pitch": 0,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6"
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 176.98,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30878D7D_70BD_D5C2_41C8_BB76CE4C9E29",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6370B080_7096_4B42_41D9_370F8B14B57A_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -5.4,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30CACDDB_70BD_D4C6_41C3_1D41E36D7BFC",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -86.31,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_32A1AFD9_70BD_D4C2_418E_4ACB45CE16ED",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 6.15,
   "distance": 1,
   "backwardYaw": -156.13,
   "panorama": "this.panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 163.8,
   "distance": 1,
   "backwardYaw": -0.63,
   "panorama": "this.panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A"
  }
 ],
 "label": "VR LOKET - 10",
 "id": "panorama_6370B080_7096_4B42_41D9_370F8B14B57A",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_646A24FC_7096_54C2_41A7_666674F68EDB",
  "this.overlay_6518CCD2_709A_34C6_41C5_E8023CDB7B59"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 3.8,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_49F512B7_70BD_CF4E_4180_A1B2F23542F0",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 178.62,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30DA9DEC_70BD_D4C3_41D7_CAFA062E2F62",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -170.96,
   "distance": 1,
   "backwardYaw": 7.03,
   "panorama": "this.panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 0.13,
   "distance": 1,
   "backwardYaw": -176.2,
   "panorama": "this.panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F"
  }
 ],
 "label": "VR LOKET - 12",
 "id": "panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_669336E8_709A_F4C2_41D4_F984F4BBAB9A",
  "this.overlay_66E91ED8_709D_D4C2_41D3_F38D5263CDF5"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -43.01,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_35809101_70BD_CD42_41D3_60E5ED9FAA47",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 171.63,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3097AD8E_70BD_D55F_41D8_852F6C16DA19",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 136.66,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_31391CCF_70BD_D4DE_41CE_05594EA8B69C",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 141.45,
   "distance": 1,
   "backwardYaw": -31.78,
   "panorama": "this.panorama_6E81D499_709D_CB42_419F_6987EF427CA1"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F"
  }
 ],
 "label": "VR TAMAN - 1",
 "id": "panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_5DF497A1_71B6_3542_41CB_47A10D5EE94E",
  "this.overlay_5EE4321F_71B7_CF7E_41DA_107AB77489BE",
  "this.overlay_5F758651_7176_D7C2_41B7_55599785D138"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 18.84,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_49E55296_70BD_CF4E_41CC_28FEDE6C4406",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 56.06,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_35D4B138_70BD_CD42_41C3_9E20EA4D3E26",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -90.94,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_31FB6C6E_70BD_DBDC_41B6_C335952EC592",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -1.38,
   "distance": 1,
   "backwardYaw": 175.46,
   "panorama": "this.panorama_426D3250_708A_CFC2_41CE_A856A7F10E90"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 171.46,
   "distance": 1,
   "backwardYaw": 0.13,
   "panorama": "this.panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7"
  }
 ],
 "label": "VR TAMAN - 37",
 "id": "panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_43D34D55_708A_75C2_41C2_0C4F2141C3BE",
  "this.overlay_455E512D_708B_CD42_41C1_C091EB57B21C"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 104.26,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_32878FFA_70BD_D4C6_41B2_993E68BABC0C",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -155.51,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3396BED0_70BD_D4C2_41CD_C46996D6A633",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -123.94,
   "distance": 1,
   "backwardYaw": -40.82,
   "panorama": "this.panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 87.8,
   "distance": 1,
   "backwardYaw": -130.64,
   "panorama": "this.panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3"
  }
 ],
 "label": "VR DINORANCH - 3",
 "id": "panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_54362882_7176_5B47_41D0_144DCEAE6014",
  "this.overlay_52C51F6F_718A_55DD_41D6_6CE7979E7B18"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -64.83,
   "distance": 1,
   "backwardYaw": 4.15,
   "panorama": "this.panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 69.9,
   "distance": 1,
   "backwardYaw": -139.93,
   "panorama": "this.panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7"
  }
 ],
 "label": "VR LOKET - 20",
 "id": "panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_6D335725_70B6_5542_41D5_FFC0CDCAEB43",
  "this.overlay_6E66FDCB_708A_54C6_417D_DF2A17DAB2B4"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_63A7101A_7097_CB46_41D7_223F644A8390_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -172.97,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_49EED2AB_70BD_CF46_41AE_0A9D138CE8B7",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -87.8,
   "distance": 1,
   "backwardYaw": -143.32,
   "panorama": "this.panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 88.81,
   "distance": 1,
   "backwardYaw": 4.4,
   "panorama": "this.panorama_7A857637_70FA_574E_41D2_791368B14100"
  }
 ],
 "label": "VR LOKET - 8",
 "id": "panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_637A716A_708A_4DC6_41B6_3535855E649A",
  "this.overlay_64E13A45_708A_FFC2_41D0_CFFC42C4FBB8"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -117.16,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30F50DB4_70BD_D543_41CD_BF9109405C80",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 29.77,
   "distance": 1,
   "backwardYaw": -147.97,
   "panorama": "this.panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -114.56,
   "distance": 1,
   "backwardYaw": 62.84,
   "panorama": "this.panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193"
  }
 ],
 "label": "VR LOKET - 5",
 "id": "panorama_7A855791_70FA_7542_41D7_DE138FDB16FF",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_613A5E1A_708E_3747_41BB_F5B300CB13D8",
  "this.overlay_61686D42_708F_D5C6_41D2_DF939A54BCDB"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -153.95,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_35C4D12D_70BD_CD42_41DA_4157DD488C6A",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "label": "VR TAMAN - 7",
 "id": "panorama_421A2144_708A_CDC2_41D4_7699C560F9F1",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "pitch": 0,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 31.78,
   "distance": 1,
   "backwardYaw": -75.74,
   "panorama": "this.panorama_6EA0CFB6_709A_354E_41D9_E6115D646438"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -130.64,
   "distance": 1,
   "backwardYaw": 87.8,
   "panorama": "this.panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D"
  }
 ],
 "label": "VR DINORANCH - 4",
 "id": "panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_55579CDC_718A_74C3_41D4_79CB5D0ABECC",
  "this.overlay_5432187C_718A_3BC3_41CF_B00682FF623E"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -148.47,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_354DE190_70BD_CD43_41C6_0420E033386C",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -15.95,
   "distance": 1,
   "backwardYaw": 93.69,
   "panorama": "this.panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 136.99,
   "distance": 1,
   "backwardYaw": 5.75,
   "panorama": "this.panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7"
  }
 ],
 "label": "VR LOKET - 22",
 "id": "panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_6ECF1E00_7097_D742_41D5_F51DB43B3166",
  "this.overlay_6FCEA4E5_7096_D4C2_41B2_44F3653AC540"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 12.06,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_330E8F64_70BD_D5C2_41CF_29EAC82FAE70",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -118.95,
   "distance": 1,
   "backwardYaw": -3.02,
   "panorama": "this.panorama_426D3250_708A_CFC2_41CE_A856A7F10E90"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_421A2144_708A_CDC2_41D4_7699C560F9F1"
  }
 ],
 "label": "VR TAMAN - 6",
 "id": "panorama_42FC18E6_708A_DCCF_41D6_B24D30972695",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_472A69AB_70B6_DD46_41D5_BC3640D095B4",
  "this.overlay_4BA106ED_70B7_D4C2_41D3_51313D53A26A"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -129,
   "distance": 1,
   "backwardYaw": 52.88,
   "panorama": "this.panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 54.64,
   "distance": 1,
   "backwardYaw": 102.88,
   "panorama": "this.panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101"
  }
 ],
 "label": "VR DINORANCH - 7",
 "id": "panorama_6EA75E31_709D_D742_418F_DBE20FF3106F",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_57D7AB72_718E_7DC7_41C6_A6376C2875DF",
  "this.overlay_560C9EB8_718E_D742_41CD_D5F9013765DE"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 46.6,
   "distance": 1,
   "backwardYaw": -82.27,
   "panorama": "this.panorama_6E84A534_709D_D543_41D1_6DF91ACE6731"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -168.75,
   "distance": 1,
   "backwardYaw": -43.34,
   "panorama": "this.panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101"
  }
 ],
 "label": "VR DINORANCH - 9",
 "id": "panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_593F2C5E_719A_5BFE_418F_ADBF08FE044E",
  "this.overlay_5AF0C9FA_719A_3CC6_41C2_FDA68F50267B"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 93.69,
   "distance": 1,
   "backwardYaw": -15.95,
   "panorama": "this.panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829"
  }
 ],
 "label": "VR LOKET - 23",
 "id": "panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_6FE27CE6_709A_74CE_41CA_9C6283A6696D"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 97.73,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_312B5CBE_70BD_D4BE_41C3_3A2177115CF0",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 148.47,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_356FA17A_70BD_CDC6_41AE_80C6C5FA2D29",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 36.68,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3143DD2E_70BD_D55E_41A1_3B24A19C1D0D",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 93.2,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_35DB3142_70BD_CDC6_41CB_FDC3166F1927",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -172.63,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_32FB2045_70BD_CBCD_41CD_5372B2B0BA0C",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 103.67,
   "distance": 1,
   "backwardYaw": -8.37,
   "panorama": "this.panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481"
  }
 ],
 "label": "VR ENTRANCE - 2",
 "id": "panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_6F0375E3_708A_54C6_41C4_A6E987AB0E9B",
  "this.overlay_5041D600_708A_5742_41D8_4D7CF123FA4A"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 176.49,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30C48DC5_70BD_D4CD_41DB_0B092D841D8F",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -31.91,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30B15D66_70BD_D5CF_41D8_083D772A002A",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -175.85,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3108FCE5_70BD_D4C2_41D9_4E38C843444B",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 5.15,
   "distance": 1,
   "backwardYaw": 152.62,
   "panorama": "this.panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -167.94,
   "distance": 1,
   "backwardYaw": 24.49,
   "panorama": "this.panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286"
  }
 ],
 "label": "VR LOKET - 17",
 "id": "panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_6A776E1C_70B6_5742_41DA_D07B5A60B6E7",
  "this.overlay_6B9F3668_70BA_37C2_41D6_DB621A8405DB"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 4.4,
   "distance": 1,
   "backwardYaw": 88.81,
   "panorama": "this.panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 159.65,
   "distance": 1,
   "backwardYaw": 17.88,
   "panorama": "this.panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490"
  }
 ],
 "label": "VR LOKET - 7",
 "id": "panorama_7A857637_70FA_574E_41D2_791368B14100",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_63CC87A9_708A_D542_41D7_CD905ADE336D",
  "this.overlay_63F9508A_708A_4B46_41BD_D2CAD272A06E"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 7.13,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_35F6B121_70BD_CD42_41CA_944B7A6FC0AA",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -20.35,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_32D9006C_70BD_CBC2_41D5_E803E16B4B83",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -27.38,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_33876EBF_70BD_D4BE_41BE_8873C9B94676",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 80.06,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_336DDF8B_70BD_D546_41CD_A3A4EA6A63F6",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -174.85,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_35E6B116_70BD_CD4F_41C8_4F7381CF16D8",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -43.34,
   "distance": 1,
   "backwardYaw": -168.75,
   "panorama": "this.panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 102.88,
   "distance": 1,
   "backwardYaw": 54.64,
   "panorama": "this.panorama_6EA75E31_709D_D742_418F_DBE20FF3106F"
  }
 ],
 "label": "VR DINORANCH - 8",
 "id": "panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_56693BFC_718A_3CC2_41DC_051BB2ED5D1C",
  "this.overlay_594750ED_718A_4CC2_41BF_AE170C7C5D07"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -162.12,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_32F52036_70BD_CB4E_41D5_00857A86D76D",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -15.95,
   "distance": 1,
   "backwardYaw": 123.22,
   "panorama": "this.panorama_6341E851_7097_DBC2_41B8_00401AC84CD8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -176.2,
   "distance": 1,
   "backwardYaw": 0.13,
   "panorama": "this.panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467"
  }
 ],
 "label": "VR LOKET - 13",
 "id": "panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_66277AAD_709A_3F42_41D5_A81AE26394C1",
  "this.overlay_6791B164_709A_CDC2_41BE_4E84732E93A4"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -3.51,
   "distance": 1,
   "backwardYaw": 169.95,
   "panorama": "this.panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F"
  }
 ],
 "label": "VR TAMAN - 33",
 "id": "panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_5ED985A9_717E_5545_41CB_6C5A0E663814",
  "this.overlay_41E274DD_717E_F4C2_41D5_1D369516A64C"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 157.93,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3351CFC4_70BD_D4C2_41BA_C215963EFBB6",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -168.19,
   "distance": 1,
   "backwardYaw": -99.94,
   "panorama": "this.panorama_6341E851_7097_DBC2_41B8_00401AC84CD8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -8.37,
   "distance": 1,
   "backwardYaw": 103.67,
   "panorama": "this.panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752"
  }
 ],
 "label": "VR ENTRANCE - 1",
 "id": "panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_6A621C8E_70BA_DB5E_41D9_506769050245",
  "this.overlay_50F98B44_708E_3DC3_41C8_50835A24E51E"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 169.95,
   "distance": 1,
   "backwardYaw": -3.51,
   "panorama": "this.panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -0.53,
   "distance": 1,
   "backwardYaw": 174.6,
   "panorama": "this.panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4"
  }
 ],
 "label": "VR TAMAN - 34",
 "id": "panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_5C835440_718D_CBC2_41CB_419277B19DF4",
  "this.overlay_5EF85288_718A_CF42_4166_EDF52A141D4E"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -8.54,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3538E159_70BD_CDC2_41D1_2E1EE8D2F08B",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 175.46,
   "distance": 1,
   "backwardYaw": -1.38,
   "panorama": "this.panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -3.02,
   "distance": 1,
   "backwardYaw": -118.95,
   "panorama": "this.panorama_42FC18E6_708A_DCCF_41D6_B24D30972695"
  }
 ],
 "label": "VR TAMAN - 5",
 "id": "panorama_426D3250_708A_CFC2_41CE_A856A7F10E90",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_44AC81D2_708A_CCC6_41DB_05FD72D5DF72",
  "this.overlay_479B6AED_70B6_3CC2_41DA_CB1C02A959CA"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 0.13,
   "distance": 1,
   "backwardYaw": 171.46,
   "panorama": "this.panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 173.27,
   "distance": 1,
   "backwardYaw": 1.63,
   "panorama": "this.panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4"
  }
 ],
 "label": "VR TAMAN - 36",
 "id": "panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_438E2FC7_7176_54CD_41D4_E7AD807B3105",
  "this.overlay_4383EE65_7176_D7C2_41D4_BA084B8FC1AA"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 179.47,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_33E4EEDF_70BD_D4FD_41DB_E09BEE7842A5",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -59.29,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3343CFB2_70BD_D546_41D2_FD1D11AA0570",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -4.54,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_316E6D07_70BD_D54E_41DB_2E460E310441",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -143.32,
   "distance": 1,
   "backwardYaw": -87.8,
   "panorama": "this.panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -0.63,
   "distance": 1,
   "backwardYaw": 163.8,
   "panorama": "this.panorama_6370B080_7096_4B42_41D9_370F8B14B57A"
  }
 ],
 "label": "VR LOKET - 9",
 "id": "panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_64FEC228_708A_4F42_41BD_D48DA5832BC4",
  "this.overlay_63371978_7096_3DC2_4193_488EFAD729E2"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -76.33,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_337C0F9D_70BD_D542_41D2_B41D5C10F007",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -10.05,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_325270E0_70BD_CCC2_41D2_E7AEF2DFA9CE",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -173.34,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_331E1F7B_70BD_D5C6_41D4_D9AC036040D8",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 24.49,
   "distance": 1,
   "backwardYaw": -167.94,
   "panorama": "this.panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -158.9,
   "distance": 1,
   "backwardYaw": 6.66,
   "panorama": "this.panorama_63A7101A_7097_CB46_41D7_223F644A8390"
  }
 ],
 "label": "VR LOKET - 16",
 "id": "panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_695AA5E3_708A_54C6_41D3_EB678C336EF6",
  "this.overlay_6962A658_708A_77C2_41D7_01E38BBB5B02"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -89.94,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3238A091_70BD_CB42_41B3_AA494C9310D2",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -126.24,
   "distance": 1,
   "backwardYaw": 42.33,
   "panorama": "this.panorama_6E84A534_709D_D543_41D1_6DF91ACE6731"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 31.53,
   "distance": 1,
   "backwardYaw": 148.09,
   "panorama": "this.panorama_6E81D499_709D_CB42_419F_6987EF427CA1"
  }
 ],
 "label": "VR DINORANCH - 11",
 "id": "panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_5B98D408_7196_4B42_41CF_6C85448FBC1E",
  "this.overlay_5D39020F_718A_4F5E_41D1_BFE3FA487C55"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -179.87,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_35B0A0F5_70BD_CCC2_41D4_66139F1D040A",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "class": "Menu",
 "selectedBackgroundColor": "#202020",
 "fontFamily": "Arial",
 "opacity": 0.4,
 "children": [
  {
   "class": "MenuItem",
   "label": "VR LOKET - 1",
   "click": "this.mainPlayList.set('selectedIndex', 0)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 2",
   "click": "this.mainPlayList.set('selectedIndex', 1)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 3",
   "click": "this.mainPlayList.set('selectedIndex', 2)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 4",
   "click": "this.mainPlayList.set('selectedIndex', 3)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 5",
   "click": "this.mainPlayList.set('selectedIndex', 4)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 6",
   "click": "this.mainPlayList.set('selectedIndex', 5)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 7",
   "click": "this.mainPlayList.set('selectedIndex', 6)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 8",
   "click": "this.mainPlayList.set('selectedIndex', 7)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 9",
   "click": "this.mainPlayList.set('selectedIndex', 8)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 16",
   "click": "this.mainPlayList.set('selectedIndex', 9)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 17",
   "click": "this.mainPlayList.set('selectedIndex', 10)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 18",
   "click": "this.mainPlayList.set('selectedIndex', 11)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 19",
   "click": "this.mainPlayList.set('selectedIndex', 12)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 20",
   "click": "this.mainPlayList.set('selectedIndex', 13)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 21",
   "click": "this.mainPlayList.set('selectedIndex', 14)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 22",
   "click": "this.mainPlayList.set('selectedIndex', 15)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 23",
   "click": "this.mainPlayList.set('selectedIndex', 16)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 10",
   "click": "this.mainPlayList.set('selectedIndex', 17)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 11",
   "click": "this.mainPlayList.set('selectedIndex', 18)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 12",
   "click": "this.mainPlayList.set('selectedIndex', 19)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 13",
   "click": "this.mainPlayList.set('selectedIndex', 20)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 14",
   "click": "this.mainPlayList.set('selectedIndex', 21)"
  },
  {
   "class": "MenuItem",
   "label": "VR LOKET - 15",
   "click": "this.mainPlayList.set('selectedIndex', 22)"
  },
  {
   "class": "MenuItem",
   "label": "VR ENTRANCE - 1",
   "click": "this.mainPlayList.set('selectedIndex', 23)"
  },
  {
   "class": "MenuItem",
   "label": "VR ENTRANCE - 2",
   "click": "this.mainPlayList.set('selectedIndex', 24)"
  },
  {
   "class": "MenuItem",
   "label": "VR ENTRANCE - 3",
   "click": "this.mainPlayList.set('selectedIndex', 25)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 1",
   "click": "this.mainPlayList.set('selectedIndex', 26)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 2",
   "click": "this.mainPlayList.set('selectedIndex', 27)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 3",
   "click": "this.mainPlayList.set('selectedIndex', 28)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 4",
   "click": "this.mainPlayList.set('selectedIndex', 29)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 5",
   "click": "this.mainPlayList.set('selectedIndex', 30)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 6",
   "click": "this.mainPlayList.set('selectedIndex', 31)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 7",
   "click": "this.mainPlayList.set('selectedIndex', 32)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 8",
   "click": "this.mainPlayList.set('selectedIndex', 33)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 9",
   "click": "this.mainPlayList.set('selectedIndex', 34)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 10",
   "click": "this.mainPlayList.set('selectedIndex', 35)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 11",
   "click": "this.mainPlayList.set('selectedIndex', 36)"
  },
  {
   "class": "MenuItem",
   "label": "VR DINORANCH - 12",
   "click": "this.mainPlayList.set('selectedIndex', 37)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 1",
   "click": "this.mainPlayList.set('selectedIndex', 38)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 34",
   "click": "this.mainPlayList.set('selectedIndex', 39)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 35",
   "click": "this.mainPlayList.set('selectedIndex', 40)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 36",
   "click": "this.mainPlayList.set('selectedIndex', 41)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 37",
   "click": "this.mainPlayList.set('selectedIndex', 42)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 2",
   "click": "this.mainPlayList.set('selectedIndex', 43)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 33",
   "click": "this.mainPlayList.set('selectedIndex', 44)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 5",
   "click": "this.mainPlayList.set('selectedIndex', 45)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 6",
   "click": "this.mainPlayList.set('selectedIndex', 46)"
  },
  {
   "class": "MenuItem",
   "label": "VR TAMAN - 7",
   "click": "this.mainPlayList.set('selectedIndex', 47)"
  }
 ],
 "label": "Media",
 "id": "Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "rollOverBackgroundColor": "#000000",
 "fontColor": "#FFFFFF",
 "rollOverOpacity": 0.8,
 "selectedFontColor": "#FFFFFF",
 "backgroundColor": "#404040",
 "rollOverFontColor": "#FFFFFF"
},
{
 "mouseControlMode": "drag_acceleration",
 "class": "PanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "viewerArea": "this.MainViewer",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "displayPlaybackBar": true
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -75.74,
   "distance": 1,
   "backwardYaw": 31.78,
   "panorama": "this.panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 89.06,
   "distance": 1,
   "backwardYaw": -31.53,
   "panorama": "this.panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E"
  }
 ],
 "label": "VR DINORANCH - 5",
 "id": "panorama_6EA0CFB6_709A_354E_41D9_E6115D646438",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_55D25EE0_718A_34C2_41D9_E673A071A980",
  "this.overlay_545EF17F_718E_4DBE_41D5_AE2A1464714A"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -174.25,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_32B7FFEA_70BD_D4C6_41B5_5F1591915C59",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 21.1,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_49E292A0_70BD_CF42_41CF_FCC83876B290",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 179.37,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_33B13EAA_70BD_D746_41D8_DBCD63D29EAA",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -86.8,
   "distance": 1,
   "backwardYaw": 120.71,
   "panorama": "this.panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 90.06,
   "distance": 1,
   "backwardYaw": -22.07,
   "panorama": "this.panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911"
  }
 ],
 "label": "VR LOKET - 2",
 "id": "panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_7E1CFA60_70FA_3FC2_41D7_E736A0EADDEB",
  "this.overlay_7FC29BAD_70F6_3D42_41D5_68D0761C19E1"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 53.76,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3328AF3D_70BD_D542_41D4_051AE221326B",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 51,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_31CE7C85_70BD_DB42_41B9_4F4AE37AAA4F",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.2,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3297200F_70BD_CB5D_41C5_3206D2A2F16C",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -31.53,
   "distance": 1,
   "backwardYaw": 89.06,
   "panorama": "this.panorama_6EA0CFB6_709A_354E_41D9_E6115D646438"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 52.88,
   "distance": 1,
   "backwardYaw": -129,
   "panorama": "this.panorama_6EA75E31_709D_D742_418F_DBE20FF3106F"
  }
 ],
 "label": "VR DINORANCH - 6",
 "id": "panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_54ACF435_718E_4B42_4199_4EC2C83D22B3",
  "this.overlay_5972BBE5_718F_DCC2_41BA_04B2866902A7"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 17.88,
   "distance": 1,
   "backwardYaw": 159.65,
   "panorama": "this.panorama_7A857637_70FA_574E_41D2_791368B14100"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -147.97,
   "distance": 1,
   "backwardYaw": 29.77,
   "panorama": "this.panorama_7A855791_70FA_7542_41D7_DE138FDB16FF"
  }
 ],
 "label": "VR LOKET - 6",
 "id": "panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_626C85D8_708E_54C2_41CA_D97358219534",
  "this.overlay_6324AEE0_708D_D4C3_4194_46C77A8EAB59"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A857637_70FA_574E_41D2_791368B14100_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -38.55,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_357F6185_70BD_CD42_41D4_2C5C315D49E5",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 42.33,
   "distance": 1,
   "backwardYaw": -126.24,
   "panorama": "this.panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -82.27,
   "distance": 1,
   "backwardYaw": 46.6,
   "panorama": "this.panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0"
  }
 ],
 "label": "VR DINORANCH - 10",
 "id": "panorama_6E84A534_709D_D543_41D1_6DF91ACE6731",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_58DE94BA_7196_4B46_41CA_6C22B3CD779C",
  "this.overlay_5B503B8F_7196_7D5E_41D3_60AD63F9D7B9"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 115.17,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_327C70C9_70BD_CCC2_41C0_CF84EE3CD445",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -22.07,
   "distance": 1,
   "backwardYaw": 90.06,
   "panorama": "this.panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA"
  }
 ],
 "label": "VR LOKET - 1",
 "id": "panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_7E8F9E30_70FE_D742_41D6_9881FCAAA31E"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 164.05,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30381E13_70BD_D745_41D6_C6626D8932B0",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -179.87,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_317DFD1D_70BD_D542_41CF_912FA0A0C8DD",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 11.25,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_31D1CC97_70BD_DB4E_41AB_92E931A25262",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -148.22,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_3519616F_70BD_CDDE_41A8_0FE585D821FA",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 123.22,
   "distance": 1,
   "backwardYaw": -15.95,
   "panorama": "this.panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -161.16,
   "distance": 1,
   "backwardYaw": -166.94,
   "panorama": "this.panorama_63A7101A_7097_CB46_41D7_223F644A8390"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -99.94,
   "distance": 1,
   "backwardYaw": -168.19,
   "panorama": "this.panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481"
  }
 ],
 "label": "VR LOKET - 14",
 "id": "panorama_6341E851_7097_DBC2_41B8_00401AC84CD8",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_67752968_7095_DDC2_41D6_3C013AD6F0B3",
  "this.overlay_67ADC820_7096_5B42_41BD_7C7E8CBA8774",
  "this.overlay_68160695_708E_5742_41D8_1326885EAA1C"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 40.07,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_311E9CF6_70BD_D4CE_41D9_7CB6690BB1F7",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 32.03,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30E70DA4_70BD_D542_41D1_EA562C16AF74",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -161.06,
   "distance": 1,
   "backwardYaw": 7.37,
   "panorama": "this.panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 62.84,
   "distance": 1,
   "backwardYaw": -114.56,
   "panorama": "this.panorama_7A855791_70FA_7542_41D7_DE138FDB16FF"
  }
 ],
 "label": "VR LOKET - 4",
 "id": "panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_603B25A8_708A_3542_41A6_9D3A2160F4BA",
  "this.overlay_602C714F_708E_4DDE_41D4_E3941653C3E5"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 174.6,
   "distance": 1,
   "backwardYaw": -0.53,
   "panorama": "this.panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 1.63,
   "distance": 1,
   "backwardYaw": 173.27,
   "panorama": "this.panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7"
  }
 ],
 "label": "VR TAMAN - 35",
 "id": "panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_40B7961A_717A_5747_41C4_6B6608C90285",
  "this.overlay_43FF33EE_717A_4CDF_41D9_064EBA7A4F59"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 4.15,
   "distance": 1,
   "backwardYaw": -64.83,
   "panorama": "this.panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -172.87,
   "distance": 1,
   "backwardYaw": 26,
   "panorama": "this.panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868"
  }
 ],
 "label": "VR LOKET - 19",
 "id": "panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_6CF08BE4_70BA_DCC2_41A7_C9C28B89ACFC",
  "this.overlay_6C983CBC_70B5_DB42_41D6_4E8D3B114E8C"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -137.67,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30A1DD55_70BD_D5C2_41BC_31A164512217",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 152.62,
   "distance": 1,
   "backwardYaw": 5.15,
   "panorama": "this.panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 26,
   "distance": 1,
   "backwardYaw": -172.87,
   "panorama": "this.panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B"
  }
 ],
 "label": "VR LOKET - 18",
 "id": "panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_6CF3F2D4_70BA_CCC3_41D8_2AB59A652FB7",
  "this.overlay_6C10E05B_70BA_4BC6_41B5_772499AB3AAF"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_camera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 11.81,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_301E6E3B_70BD_D745_41B1_1F2F5A6A7736",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "media": "this.panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "media": "this.panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "media": "this.panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "media": "this.panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "media": "this.panorama_7A855791_70FA_7542_41D7_DE138FDB16FF",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "media": "this.panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "media": "this.panorama_7A857637_70FA_574E_41D2_791368B14100",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A857637_70FA_574E_41D2_791368B14100_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "media": "this.panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "media": "this.panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "media": "this.panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "media": "this.panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "media": "this.panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "media": "this.panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "media": "this.panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "media": "this.panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "media": "this.panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "media": "this.panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "media": "this.panorama_6370B080_7096_4B42_41D9_370F8B14B57A",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6370B080_7096_4B42_41D9_370F8B14B57A_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "media": "this.panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "media": "this.panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "media": "this.panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "media": "this.panorama_6341E851_7097_DBC2_41B8_00401AC84CD8",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "media": "this.panorama_63A7101A_7097_CB46_41D7_223F644A8390",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_63A7101A_7097_CB46_41D7_223F644A8390_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "media": "this.panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "media": "this.panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "media": "this.panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "media": "this.panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "media": "this.panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "media": "this.panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "media": "this.panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 31)",
   "media": "this.panorama_6EA0CFB6_709A_354E_41D9_E6115D646438",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 31, 32)",
   "media": "this.panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 32, 33)",
   "media": "this.panorama_6EA75E31_709D_D742_418F_DBE20FF3106F",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 33, 34)",
   "media": "this.panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 34, 35)",
   "media": "this.panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 35, 36)",
   "media": "this.panorama_6E84A534_709D_D543_41D1_6DF91ACE6731",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 36, 37)",
   "media": "this.panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 37, 38)",
   "media": "this.panorama_6E81D499_709D_CB42_419F_6987EF427CA1",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6E81D499_709D_CB42_419F_6987EF427CA1_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 38, 39)",
   "media": "this.panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 39, 40)",
   "media": "this.panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 40, 41)",
   "media": "this.panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 41, 42)",
   "media": "this.panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 42, 43)",
   "media": "this.panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 43, 44)",
   "media": "this.panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5F8DD965_7176_5DC2_41C4_D46216B19F59_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 44, 45)",
   "media": "this.panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 45, 46)",
   "media": "this.panorama_426D3250_708A_CFC2_41CE_A856A7F10E90",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 46, 47)",
   "media": "this.panorama_42FC18E6_708A_DCCF_41D6_B24D30972695",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "end": "this.trigger('tourEnded')",
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 47, 0)",
   "media": "this.panorama_421A2144_708A_CDC2_41D4_7699C560F9F1",
   "camera": "this.panorama_421A2144_708A_CDC2_41D4_7699C560F9F1_camera"
  }
 ],
 "id": "mainPlayList"
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 139.18,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_30438E74_70BD_D7C2_41C2_CECA0952DE3A",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 7.03,
   "distance": 1,
   "backwardYaw": -170.96,
   "panorama": "this.panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -156.13,
   "distance": 1,
   "backwardYaw": 6.15,
   "panorama": "this.panorama_6370B080_7096_4B42_41D9_370F8B14B57A"
  }
 ],
 "label": "VR LOKET - 11",
 "id": "panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_t.jpg",
 "class": "Panorama",
 "vfov": 180,
 "overlays": [
  "this.overlay_657FD632_709A_7747_41B1_922AF7F89AFA",
  "this.overlay_6682EF89_709B_D545_4190_8643637AB07E"
 ],
 "partial": false,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "hfov": 360,
 "cardboardMenu": "this.Menu_3182DC22_70BD_DB47_41D7_6500D5B3A6A6",
 "pitch": 0
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -127.12,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_320E50A0_70BD_CB42_41C4_48BA155C28DE",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "restartMovementOnUserInteraction": false
 }
},
{
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderSize": 0,
 "progressBarBorderRadius": 0,
 "width": "100%",
 "playbackBarBorderRadius": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarProgressBorderColor": "#000000",
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipFontFamily": "Arial",
 "progressLeft": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadBorderSize": 0,
 "toolTipTextShadowOpacity": 0,
 "toolTipFontStyle": "normal",
 "transitionDuration": 500,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "playbackBarProgressOpacity": 1,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "paddingLeft": 0,
 "minWidth": 100,
 "borderSize": 0,
 "height": "100%",
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "class": "ViewerArea",
 "toolTipShadowVerticalLength": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "toolTipFontColor": "#606060",
 "progressBottom": 0,
 "vrPointerSelectionTime": 2000,
 "playbackBarHeadShadow": true,
 "shadow": false,
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "progressBarOpacity": 1,
 "toolTipPaddingLeft": 6,
 "paddingRight": 0,
 "toolTipDisplayTime": 600,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipPaddingTop": 4,
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "displayTooltipInTouchScreens": true,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBarBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "progressBorderColor": "#000000",
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "paddingTop": 0,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "toolTipBorderColor": "#767676",
 "toolTipFontSize": "1.11vmin",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipPaddingBottom": 4,
 "paddingBottom": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "data": {
  "name": "Main Viewer"
 },
 "toolTipShadowColor": "#333333",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 120.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -13.75,
   "hfov": 12.2
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA, this.camera_35DB3142_70BD_CDC6_41CB_FDC3166F1927); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "items": [
  {
   "pitch": -13.75,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 120.71,
   "hfov": 12.2,
   "image": "this.AnimatedImageResource_6879C4E7_709E_34CE_41DC_0B96368C18F1",
   "distance": 100
  }
 ],
 "id": "overlay_61C3CCA8_70F6_5B42_41D8_FC4084EACB2E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 7.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -8.12,
   "hfov": 6.44
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193, this.camera_352AE14E_70BD_CDDE_41DB_D339246DC79B); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "pitch": -8.12,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 7.37,
   "hfov": 6.44,
   "image": "this.AnimatedImageResource_687914E7_709E_34CE_41D6_625AE8835B0A",
   "distance": 100
  }
 ],
 "id": "overlay_60096C8B_70F6_3B46_41D7_353E5E45E560",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 36.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -18.1,
   "hfov": 5.94
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 26)"
  }
 ],
 "items": [
  {
   "pitch": -18.1,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 36.73,
   "hfov": 5.94,
   "image": "this.AnimatedImageResource_4685DD68_708A_35C2_419F_BD4371710882",
   "distance": 100
  }
 ],
 "id": "overlay_51F4A862_708A_5BC7_41D3_70CDD62544B3",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -31.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -35.36,
   "hfov": 10.24
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224, this.camera_357F6185_70BD_CD42_41D4_2C5C315D49E5); this.mainPlayList.set('selectedIndex', 38)"
  }
 ],
 "items": [
  {
   "pitch": -35.36,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -31.78,
   "hfov": 10.24,
   "image": "this.AnimatedImageResource_469B5D6E_708A_35DE_41C1_A01239035CCA",
   "distance": 100
  }
 ],
 "id": "overlay_5DFE1C90_718A_FB42_41B5_AED425EDF7A2",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 148.09,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -25.06,
   "hfov": 11.38
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9, this.camera_354DE190_70BD_CD43_41C6_0420E033386C); this.mainPlayList.set('selectedIndex', 36)"
  }
 ],
 "items": [
  {
   "pitch": -25.06,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 148.09,
   "hfov": 11.38,
   "image": "this.AnimatedImageResource_469BFD6E_708A_35DE_4193_23C754293A42",
   "distance": 100
  }
 ],
 "id": "overlay_5FDDCF67_718A_35CE_41D2_0AE08592C989",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -9.54,
   "hfov": 8.89
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829, this.camera_35809101_70BD_CD42_41D3_60E5ED9FAA47); this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "items": [
  {
   "pitch": -9.54,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 5.75,
   "hfov": 8.89,
   "image": "this.AnimatedImageResource_468C5D64_708A_35C2_41C7_AE067C06808A",
   "distance": 50
  }
 ],
 "id": "overlay_6F4C5092_708A_4B46_41AF_4049D9FB9201",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c Left-Up"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -139.93,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -18.65,
   "hfov": 11.19
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93, this.camera_3596810C_70BD_CD42_41BB_221A7ED60724); this.mainPlayList.set('selectedIndex', 13)"
  }
 ],
 "items": [
  {
   "pitch": -18.65,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -139.93,
   "hfov": 11.19,
   "image": "this.AnimatedImageResource_468CFD64_708A_35C2_41D2_AB8DB7BA4D18",
   "distance": 100
  }
 ],
 "id": "overlay_6D7052E4_708B_CCC2_41D0_C1A632E9E274",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -20.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -1.32,
   "hfov": 7.44
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_1_HS_0_0.png",
      "class": "ImageResourceLevel",
      "width": 119,
      "height": 119
     }
    ]
   },
   "pitch": -1.32,
   "yaw": -20.17,
   "hfov": 7.44
  }
 ],
 "id": "overlay_536363E4_7175_CCC2_41D8_12492C87E5A1",
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 26.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -26.9,
   "hfov": 11.71
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758, this.camera_326CE0BE_70BD_CCBE_41B0_8498CC39946F); this.mainPlayList.set('selectedIndex', 27)"
  }
 ],
 "items": [
  {
   "pitch": -26.9,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 26.05,
   "hfov": 11.71,
   "image": "this.AnimatedImageResource_46844D68_708A_35C2_41AE_951B0C69039A",
   "distance": 100
  }
 ],
 "id": "overlay_532C387C_7176_3BC2_41C9_61D8345F30F8",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 155.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -26.32,
   "hfov": 11.26
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4, this.camera_35C4D12D_70BD_CD42_41DA_4157DD488C6A); this.mainPlayList.set('selectedIndex', 26)"
  }
 ],
 "items": [
  {
   "pitch": -26.32,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 155.88,
   "hfov": 11.26,
   "image": "this.AnimatedImageResource_4684DD68_708A_35C2_4161_B9908524F9FA",
   "distance": 100
  }
 ],
 "id": "overlay_53AE9FFF_717A_F4BE_41BD_1CBD09C7529F",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -40.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -24.05,
   "hfov": 11.47
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D, this.camera_35D4B138_70BD_CD42_41C3_9E20EA4D3E26); this.mainPlayList.set('selectedIndex', 28)"
  }
 ],
 "items": [
  {
   "pitch": -24.05,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -40.82,
   "hfov": 11.47,
   "image": "this.AnimatedImageResource_46836D69_708A_35C2_41BC_267BBCACB050",
   "distance": 100
  }
 ],
 "id": "overlay_5387DDD9_7176_54C5_41B2_456302F13002",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -12.25,
   "hfov": 12.28
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286, this.camera_49E292A0_70BD_CF42_41CF_FCC83876B290); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "items": [
  {
   "pitch": -12.25,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 6.66,
   "hfov": 12.28,
   "image": "this.AnimatedImageResource_6AAA3DEA_708E_34C7_41DA_9C4861BD3054",
   "distance": 100
  }
 ],
 "id": "overlay_68BEC6F0_7096_34C2_418F_7F8125B1B1DE",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -166.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -20.29,
   "hfov": 11.78
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6341E851_7097_DBC2_41B8_00401AC84CD8, this.camera_49E55296_70BD_CF4E_41CC_28FEDE6C4406); this.mainPlayList.set('selectedIndex', 21)"
  }
 ],
 "items": [
  {
   "pitch": -20.29,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -166.94,
   "hfov": 11.78,
   "image": "this.AnimatedImageResource_6AA5FDEA_708E_34C7_41D2_649ADDC79BD9",
   "distance": 100
  }
 ],
 "id": "overlay_68313E58_708A_F7C2_41DA_C3D1F5953EF8",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -18.78,
   "hfov": 11.89
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D, this.camera_33A14E99_70BD_D742_41CF_B0CBD14BFED2); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "items": [
  {
   "pitch": -18.78,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 6.15,
   "hfov": 11.89,
   "image": "this.AnimatedImageResource_686614EA_709E_34C6_41BF_F6D268B3A1B5",
   "distance": 100
  }
 ],
 "id": "overlay_646A24FC_7096_54C2_41A7_666674F68EDB",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 163.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -40.11,
   "hfov": 14.41
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A, this.camera_33B13EAA_70BD_D746_41D8_DBCD63D29EAA); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "pitch": -40.11,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 163.8,
   "hfov": 14.41,
   "image": "this.AnimatedImageResource_6867B4EA_709E_34C6_41AB_42A33D9ADA0F",
   "distance": 100
  }
 ],
 "id": "overlay_6518CCD2_709A_34C6_41C5_E8023CDB7B59",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -13.25,
   "hfov": 12.23
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F, this.camera_49F512B7_70BD_CF4E_4180_A1B2F23542F0); this.mainPlayList.set('selectedIndex', 20)"
  }
 ],
 "items": [
  {
   "pitch": -13.25,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 0.13,
   "hfov": 12.23,
   "image": "this.AnimatedImageResource_686084EA_709E_34C6_41D5_133D17124CF6",
   "distance": 100
  }
 ],
 "id": "overlay_669336E8_709A_F4C2_41D4_F984F4BBAB9A",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -170.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -24.56,
   "hfov": 16.91
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D, this.camera_49EED2AB_70BD_CF46_41AE_0A9D138CE8B7); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "items": [
  {
   "pitch": -24.56,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -170.96,
   "hfov": 16.91,
   "image": "this.AnimatedImageResource_6ADD027A_7097_CFC6_41CA_79694A5B0ECD",
   "distance": 100
  }
 ],
 "id": "overlay_66E91ED8_709D_D4C2_41D3_F38D5263CDF5",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 141.45,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -19.91,
   "hfov": 7.68
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E81D499_709D_CB42_419F_6987EF427CA1, this.camera_33C41F06_70BD_D54F_41DB_0E4E480C10B5); this.mainPlayList.set('selectedIndex', 37)"
  }
 ],
 "items": [
  {
   "pitch": -19.91,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 141.45,
   "hfov": 7.68,
   "image": "this.AnimatedImageResource_469A6D6E_708A_35DE_41D7_3BD7B59ED5D1",
   "distance": 100
  }
 ],
 "id": "overlay_5DF497A1_71B6_3542_41CB_47A10D5EE94E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -53.89,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -23.3,
   "hfov": 15.23
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 39)"
  }
 ],
 "items": [
  {
   "pitch": -23.3,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -53.89,
   "hfov": 15.23,
   "image": "this.AnimatedImageResource_469AED6F_708A_35DE_419E_5E5D57B0A880",
   "distance": 100
  }
 ],
 "id": "overlay_5EE4321F_71B7_CF7E_41DA_107AB77489BE",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.39,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -26.06,
   "hfov": 11.28
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "items": [
  {
   "pitch": -26.06,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 2.39,
   "hfov": 11.28,
   "image": "this.AnimatedImageResource_46997D6F_708A_35DE_41D0_1B3A84FB15BA",
   "distance": 100
  }
 ],
 "id": "overlay_5F758651_7176_D7C2_41B7_55599785D138",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 171.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -19.28,
   "hfov": 11.86
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7, this.camera_317DFD1D_70BD_D542_41CF_912FA0A0C8DD); this.mainPlayList.set('selectedIndex', 41)"
  }
 ],
 "items": [
  {
   "pitch": -19.28,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 171.46,
   "hfov": 11.86,
   "image": "this.AnimatedImageResource_4696AD71_708A_35C2_41D1_A639811C3CFF",
   "distance": 100
  }
 ],
 "id": "overlay_43D34D55_708A_75C2_41C2_0C4F2141C3BE",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -1.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -21.79,
   "hfov": 11.66
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_426D3250_708A_CFC2_41CE_A856A7F10E90, this.camera_316E6D07_70BD_D54E_41DB_2E460E310441); this.mainPlayList.set('selectedIndex', 45)"
  }
 ],
 "items": [
  {
   "pitch": -21.79,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -1.38,
   "hfov": 11.66,
   "image": "this.AnimatedImageResource_31ADCC06_70BD_DB4E_41DA_96ECBEEFF68F",
   "distance": 100
  }
 ],
 "id": "overlay_455E512D_708B_CD42_41C1_C091EB57B21C",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -123.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -32.92,
   "hfov": 13.08
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758, this.camera_30438E74_70BD_D7C2_41C2_CECA0952DE3A); this.mainPlayList.set('selectedIndex', 27)"
  }
 ],
 "items": [
  {
   "pitch": -32.92,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -123.94,
   "hfov": 13.08,
   "image": "this.AnimatedImageResource_4683ED69_708A_35C2_41C0_F9FF30B83AB2",
   "distance": 50
  }
 ],
 "id": "overlay_54362882_7176_5B47_41D0_144DCEAE6014",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c Left-Up"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 87.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -36.24,
   "hfov": 17.83
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3, this.camera_30518E84_70BD_D742_41C3_56587FDCB793); this.mainPlayList.set('selectedIndex', 29)"
  }
 ],
 "items": [
  {
   "pitch": -36.24,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 87.8,
   "hfov": 17.83,
   "image": "this.AnimatedImageResource_46820D69_708A_35C2_41D1_0CB51219E096",
   "distance": 100
  }
 ],
 "id": "overlay_52C51F6F_718A_55DD_41D6_6CE7979E7B18",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 69.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -12.28,
   "hfov": 8.4
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7, this.camera_311E9CF6_70BD_D4CE_41D9_7CB6690BB1F7); this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "items": [
  {
   "pitch": -12.28,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 69.9,
   "hfov": 8.4,
   "image": "this.AnimatedImageResource_468D9D63_708A_35C6_41DB_3D971D6F6809",
   "distance": 100
  }
 ],
 "id": "overlay_6D335725_70B6_5542_41D5_FFC0CDCAEB43",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -64.83,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -25.52,
   "hfov": 11.74
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B, this.camera_3108FCE5_70BD_D4C2_41D9_4E38C843444B); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "items": [
  {
   "pitch": -25.52,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -64.83,
   "hfov": 11.74,
   "image": "this.AnimatedImageResource_468C3D63_708A_35C6_41D5_F9180DC81E96",
   "distance": 50
  }
 ],
 "id": "overlay_6E66FDCB_708A_54C6_417D_DF2A17DAB2B4",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c Left-Up"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 88.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -30.08,
   "hfov": 10.87
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A857637_70FA_574E_41D2_791368B14100, this.camera_3153ED44_70BD_D5C2_41B9_0788D610DBCF); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "items": [
  {
   "pitch": -30.08,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 88.81,
   "hfov": 10.87,
   "image": "this.AnimatedImageResource_686594E9_709E_34C2_41B1_ECE84728D62D",
   "distance": 100
  }
 ],
 "id": "overlay_637A716A_708A_4DC6_41B6_3535855E649A",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -87.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -30.59,
   "hfov": 10.81
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A, this.camera_3143DD2E_70BD_D55E_41A1_3B24A19C1D0D); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "items": [
  {
   "pitch": -30.59,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -87.8,
   "hfov": 10.81,
   "image": "this.AnimatedImageResource_686524E9_709E_34C2_41D8_FAF2818CA26E",
   "distance": 100
  }
 ],
 "id": "overlay_64E13A45_708A_FFC2_41D0_CFFC42C4FBB8",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 29.77,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -22.67,
   "hfov": 24.57
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490, this.camera_30E70DA4_70BD_D542_41D1_EA562C16AF74); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "items": [
  {
   "pitch": -22.67,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 29.77,
   "hfov": 24.57,
   "image": "this.AnimatedImageResource_687BE4E8_709E_34C2_41CA_CBA5C9030704",
   "distance": 100
  }
 ],
 "id": "overlay_613A5E1A_708E_3747_41BB_F5B300CB13D8",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -114.56,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -21.54,
   "hfov": 10.98
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193, this.camera_30F50DB4_70BD_D543_41CD_BF9109405C80); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "items": [
  {
   "pitch": -21.54,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -114.56,
   "hfov": 10.98,
   "image": "this.AnimatedImageResource_687B24E8_709E_34C2_41D6_421084C95960",
   "distance": 100
  }
 ],
 "id": "overlay_61686D42_708F_D5C6_41D2_DF939A54BCDB",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 31.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -26.82,
   "hfov": 11.21
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA0CFB6_709A_354E_41D9_E6115D646438, this.camera_32878FFA_70BD_D4C6_41B2_993E68BABC0C); this.mainPlayList.set('selectedIndex', 30)"
  }
 ],
 "items": [
  {
   "pitch": -26.82,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 31.78,
   "hfov": 11.21,
   "image": "this.AnimatedImageResource_46829D69_708A_35C5_41B1_5576301BEA8E",
   "distance": 100
  }
 ],
 "id": "overlay_55579CDC_718A_74C3_41D4_79CB5D0ABECC",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -130.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -58.72,
   "hfov": 10.56
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D, this.camera_3297200F_70BD_CB5D_41C5_3206D2A2F16C); this.mainPlayList.set('selectedIndex', 28)"
  }
 ],
 "items": [
  {
   "pitch": -58.72,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -130.64,
   "hfov": 10.56,
   "image": "this.AnimatedImageResource_46812D6A_708A_35C6_41CA_BACCD5B5CA0D",
   "distance": 50
  }
 ],
 "id": "overlay_5432187C_718A_3BC3_41CF_B00682FF623E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c Left-Up"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -15.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -17.52,
   "hfov": 11.98
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA, this.camera_32A1AFD9_70BD_D4C2_418E_4ACB45CE16ED); this.mainPlayList.set('selectedIndex', 16)"
  }
 ],
 "items": [
  {
   "pitch": -17.52,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -15.95,
   "hfov": 11.98,
   "image": "this.AnimatedImageResource_468B2D64_708A_35C2_41B9_C58E523065DC",
   "distance": 100
  }
 ],
 "id": "overlay_6ECF1E00_7097_D742_41D5_F51DB43B3166",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 136.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -16.88,
   "hfov": 22.12
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7, this.camera_32B7FFEA_70BD_D4C6_41B5_5F1591915C59); this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "items": [
  {
   "pitch": -16.88,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 136.99,
   "hfov": 22.12,
   "image": "this.AnimatedImageResource_468BBD64_708A_35C2_41C4_238996049F0B",
   "distance": 50
  }
 ],
 "id": "overlay_6FCEA4E5_7096_D4C2_41B2_44F3653AC540",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c Right-Up"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -118.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -33.35,
   "hfov": 10.49
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_426D3250_708A_CFC2_41CE_A856A7F10E90, this.camera_30878D7D_70BD_D5C2_41C8_BB76CE4C9E29); this.mainPlayList.set('selectedIndex', 45)"
  }
 ],
 "items": [
  {
   "pitch": -33.35,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -118.95,
   "hfov": 10.49,
   "image": "this.AnimatedImageResource_31A87C08_70BD_DB42_41D4_9DBB2EF45E11",
   "distance": 100
  }
 ],
 "id": "overlay_472A69AB_70B6_DD46_41D5_BC3640D095B4",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 55.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -19.78,
   "hfov": 11.82
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 47)"
  }
 ],
 "items": [
  {
   "pitch": -19.78,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 55.9,
   "hfov": 11.82,
   "image": "this.AnimatedImageResource_31A8FC08_70BD_DB42_4190_A9923A1F1EDE",
   "distance": 100
  }
 ],
 "id": "overlay_4BA106ED_70B7_D4C2_41D3_51313D53A26A",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 54.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -25.81,
   "hfov": 11.31
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101, this.camera_321E00B1_70BD_CB42_41D0_2FC82E3100C7); this.mainPlayList.set('selectedIndex', 33)"
  }
 ],
 "items": [
  {
   "pitch": -25.81,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 54.64,
   "hfov": 11.31,
   "image": "this.AnimatedImageResource_4680AD6B_708A_35C6_41D5_F408B9BE848B",
   "distance": 100
  }
 ],
 "id": "overlay_57D7AB72_718E_7DC7_41C6_A6376C2875DF",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -129,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -42.14,
   "hfov": 9.31
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E, this.camera_320E50A0_70BD_CB42_41C4_48BA155C28DE); this.mainPlayList.set('selectedIndex', 31)"
  }
 ],
 "items": [
  {
   "pitch": -42.14,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -129,
   "hfov": 9.31,
   "image": "this.AnimatedImageResource_469F2D6B_708A_35C6_41D5_A60DFB65D9A5",
   "distance": 100
  }
 ],
 "id": "overlay_560C9EB8_718E_D742_41CD_D5F9013765DE",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 46.6,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -30.59,
   "hfov": 10.81
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E84A534_709D_D543_41D1_6DF91ACE6731, this.camera_312B5CBE_70BD_D4BE_41C3_3A2177115CF0); this.mainPlayList.set('selectedIndex', 35)"
  }
 ],
 "items": [
  {
   "pitch": -30.59,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 46.6,
   "hfov": 10.81,
   "image": "this.AnimatedImageResource_469E5D6C_708A_35C2_41A0_F79AD8A9F337",
   "distance": 100
  }
 ],
 "id": "overlay_593F2C5E_719A_5BFE_418F_ADBF08FE044E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -168.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -26.08,
   "hfov": 5.61
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101, this.camera_31391CCF_70BD_D4DE_41CE_05594EA8B69C); this.mainPlayList.set('selectedIndex', 33)"
  }
 ],
 "items": [
  {
   "pitch": -26.08,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -168.75,
   "hfov": 5.61,
   "image": "this.AnimatedImageResource_469EED6C_708A_35C2_41B0_5237887473D2",
   "distance": 100
  }
 ],
 "id": "overlay_5AF0C9FA_719A_3CC6_41C2_FDA68F50267B",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 93.69,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -5.43,
   "hfov": 6.22
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829, this.camera_31F33C5E_70BD_DBFE_41DC_46691B07C3A4); this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "items": [
  {
   "pitch": -5.43,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 93.69,
   "hfov": 6.22,
   "image": "this.AnimatedImageResource_468BDD64_708A_35C2_41A4_CD3745568A32",
   "distance": 100
  }
 ],
 "id": "overlay_6FE27CE6_709A_74CE_41CA_9C6283A6696D",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 103.67,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -21.48,
   "hfov": 5.82
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481, this.camera_3097AD8E_70BD_D55F_41D8_852F6C16DA19); this.mainPlayList.set('selectedIndex', 23)"
  }
 ],
 "items": [
  {
   "pitch": -21.48,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 103.67,
   "hfov": 5.82,
   "image": "this.AnimatedImageResource_4686CD67_708A_35CE_41D3_77BFFAA20465",
   "distance": 100
  }
 ],
 "id": "overlay_6F0375E3_708A_54C6_41C4_A6E987AB0E9B",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -68.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -27.04,
   "hfov": 6.09
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 25)"
  }
 ],
 "items": [
  {
   "pitch": -27.04,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -68.57,
   "hfov": 6.09,
   "image": "this.AnimatedImageResource_46854D68_708A_35C2_41D7_059999E7DB6C",
   "distance": 100
  }
 ],
 "id": "overlay_5041D600_708A_5742_41D8_4D7CF123FA4A",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -14.76,
   "hfov": 12.15
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868, this.camera_33876EBF_70BD_D4BE_41BE_8873C9B94676); this.mainPlayList.set('selectedIndex', 11)"
  }
 ],
 "items": [
  {
   "pitch": -14.76,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 5.15,
   "hfov": 12.15,
   "image": "this.AnimatedImageResource_6F0217BE_70B6_54BE_41B0_2AD7924EAB62",
   "distance": 100
  }
 ],
 "id": "overlay_6A776E1C_70B6_5742_41DA_D07B5A60B6E7",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -167.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -23.8,
   "hfov": 11.49
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286, this.camera_3396BED0_70BD_D4C2_41CD_C46996D6A633); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "items": [
  {
   "pitch": -23.8,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -167.94,
   "hfov": 11.49,
   "image": "this.AnimatedImageResource_468FDD62_708A_35C6_41DC_26AF1B708B70",
   "distance": 100
  }
 ],
 "id": "overlay_6B9F3668_70BA_37C2_41D6_DB621A8405DB",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 4.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -36.36,
   "hfov": 10.11
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769, this.camera_32E56020_70BD_CB43_41B9_D0B161A2BD56); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "items": [
  {
   "pitch": -36.36,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 4.4,
   "hfov": 10.11,
   "image": "this.AnimatedImageResource_686424E9_709E_34C2_41B8_46CEA6440040",
   "distance": 100
  }
 ],
 "id": "overlay_63CC87A9_708A_D542_41D7_CD905ADE336D",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 159.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -29.2,
   "hfov": 16.67
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490, this.camera_32F52036_70BD_CB4E_41D5_00857A86D76D); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "items": [
  {
   "pitch": -29.2,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 159.65,
   "hfov": 16.67,
   "image": "this.AnimatedImageResource_686454E9_709E_34C2_41C9_C47F2C274EF0",
   "distance": 100
  }
 ],
 "id": "overlay_63F9508A_708A_4B46_41BD_D2CAD272A06E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 102.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -35.36,
   "hfov": 10.24
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA75E31_709D_D742_418F_DBE20FF3106F, this.camera_3124ECAD_70BD_DB42_41C2_D5F6596521F3); this.mainPlayList.set('selectedIndex', 32)"
  }
 ],
 "items": [
  {
   "pitch": -35.36,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 102.88,
   "hfov": 10.24,
   "image": "this.AnimatedImageResource_469F4D6C_708A_35C2_41C1_2A870F4DBA29",
   "distance": 100
  }
 ],
 "id": "overlay_56693BFC_718A_3CC2_41DC_051BB2ED5D1C",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -43.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -36.87,
   "hfov": 10.05
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0, this.camera_31D1CC97_70BD_DB4E_41AB_92E931A25262); this.mainPlayList.set('selectedIndex', 34)"
  }
 ],
 "items": [
  {
   "pitch": -36.87,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -43.34,
   "hfov": 10.05,
   "image": "this.AnimatedImageResource_469FCD6C_708A_35C2_41CD_11EA38D7AA03",
   "distance": 100
  }
 ],
 "id": "overlay_594750ED_718A_4CC2_41BF_AE170C7C5D07",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -15.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -23.3,
   "hfov": 11.54
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6341E851_7097_DBC2_41B8_00401AC84CD8, this.camera_35A240EA_70BD_CCC7_4191_9899893FB08B); this.mainPlayList.set('selectedIndex', 21)"
  }
 ],
 "items": [
  {
   "pitch": -23.3,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -15.95,
   "hfov": 11.54,
   "image": "this.AnimatedImageResource_6ADD927B_7097_CFC6_41DB_A7C71D5D0803",
   "distance": 100
  }
 ],
 "id": "overlay_66277AAD_709A_3F42_41D5_A81AE26394C1",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -176.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -8.6,
   "hfov": 6.85
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467, this.camera_35B0A0F5_70BD_CCC2_41D4_66139F1D040A); this.mainPlayList.set('selectedIndex', 19)"
  }
 ],
 "items": [
  {
   "pitch": -8.6,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -176.2,
   "hfov": 6.85,
   "image": "this.AnimatedImageResource_6ADDC27B_7097_CFC6_41C1_90055294ADF8",
   "distance": 100
  }
 ],
 "id": "overlay_6791B164_709A_CDC2_41BE_4E84732E93A4",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 87.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -6.85,
   "hfov": 6.21
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 38)"
  }
 ],
 "items": [
  {
   "pitch": -6.85,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 87.28,
   "hfov": 6.21,
   "image": "this.AnimatedImageResource_4697BD71_708A_35C2_41D7_1878258EC101",
   "distance": 100
  }
 ],
 "id": "overlay_5ED985A9_717E_5545_41CB_6C5A0E663814",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -3.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -25.92,
   "hfov": 10.41
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F, this.camera_325270E0_70BD_CCC2_41D2_E7AEF2DFA9CE); this.mainPlayList.set('selectedIndex', 39)"
  }
 ],
 "items": [
  {
   "pitch": -25.92,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -3.51,
   "hfov": 10.41,
   "image": "this.AnimatedImageResource_4697CD72_708A_35C6_41CE_111E5153B6CF",
   "distance": 100
  }
 ],
 "id": "overlay_41E274DD_717E_F4C2_41D5_1D369516A64C",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -168.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -17.52,
   "hfov": 11.98
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6341E851_7097_DBC2_41B8_00401AC84CD8, this.camera_336DDF8B_70BD_D546_41CD_A3A4EA6A63F6); this.mainPlayList.set('selectedIndex', 21)"
  }
 ],
 "items": [
  {
   "pitch": -17.52,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -168.19,
   "hfov": 11.98,
   "image": "this.AnimatedImageResource_46860D67_708A_35CE_41D3_AC0AF7925D5C",
   "distance": 100
  }
 ],
 "id": "overlay_6A621C8E_70BA_DB5E_41D9_506769050245",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -8.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -29.3,
   "hfov": 8.83
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752, this.camera_337C0F9D_70BD_D542_41D2_B41D5C10F007); this.mainPlayList.set('selectedIndex', 24)"
  }
 ],
 "items": [
  {
   "pitch": -29.3,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -8.37,
   "hfov": 8.83,
   "image": "this.AnimatedImageResource_46869D67_708A_35CE_41D2_927A6415A00A",
   "distance": 100
  }
 ],
 "id": "overlay_50F98B44_708E_3DC3_41C8_50835A24E51E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -0.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -19.29,
   "hfov": 11.86
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4, this.camera_30CACDDB_70BD_D4C6_41C3_1D41E36D7BFC); this.mainPlayList.set('selectedIndex', 40)"
  }
 ],
 "items": [
  {
   "pitch": -19.29,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -0.53,
   "hfov": 11.86,
   "image": "this.AnimatedImageResource_4699BD6F_708A_35DE_41D3_D87A18699831",
   "distance": 100
  }
 ],
 "id": "overlay_5C835440_718D_CBC2_41CB_419277B19DF4",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 169.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -35.61,
   "hfov": 10.21
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B, this.camera_30C48DC5_70BD_D4CD_41DB_0B092D841D8F); this.mainPlayList.set('selectedIndex', 44)"
  }
 ],
 "items": [
  {
   "pitch": -35.61,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 169.95,
   "hfov": 10.21,
   "image": "this.AnimatedImageResource_46983D6F_708A_35DE_41B5_6CD06D3F3194",
   "distance": 100
  }
 ],
 "id": "overlay_5EF85288_718A_CF42_4166_EDF52A141D4E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 175.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -21.35,
   "hfov": 8.05
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63, this.camera_30DA9DEC_70BD_D4C3_41D7_CAFA062E2F62); this.mainPlayList.set('selectedIndex', 42)"
  }
 ],
 "items": [
  {
   "pitch": -21.35,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 175.46,
   "hfov": 8.05,
   "image": "this.AnimatedImageResource_31AF1C07_70BD_DB4E_41D1_05AAF70FA266",
   "distance": 100
  }
 ],
 "id": "overlay_44AC81D2_708A_CCC6_41DB_05FD72D5DF72",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -3.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -14.12,
   "hfov": 12.18
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_42FC18E6_708A_DCCF_41D6_B24D30972695, this.camera_3028CE02_70BD_D746_41C6_FD110B30CEDB); this.mainPlayList.set('selectedIndex', 46)"
  }
 ],
 "items": [
  {
   "pitch": -14.12,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -3.02,
   "hfov": 12.18,
   "image": "this.AnimatedImageResource_31AFEC07_70BD_DB4E_41CA_CB2526990B74",
   "distance": 100
  }
 ],
 "id": "overlay_479B6AED_70B6_3CC2_41DA_CB1C02A959CA",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -22.3,
   "hfov": 11.62
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63, this.camera_3538E159_70BD_CDC2_41D1_2E1EE8D2F08B); this.mainPlayList.set('selectedIndex', 42)"
  }
 ],
 "items": [
  {
   "pitch": -22.3,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 0.13,
   "hfov": 11.62,
   "image": "this.AnimatedImageResource_4697BD70_708A_35C2_419D_3589C1BCCA5F",
   "distance": 100
  }
 ],
 "id": "overlay_438E2FC7_7176_54CD_41D4_E7AD807B3105",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 173.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -22.36,
   "hfov": 9.87
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4, this.camera_3508D163_70BD_CDC5_41D5_5B0E23081B83); this.mainPlayList.set('selectedIndex', 40)"
  }
 ],
 "items": [
  {
   "pitch": -22.36,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 173.27,
   "hfov": 9.87,
   "image": "this.AnimatedImageResource_46962D71_708A_35C2_41BE_FBD74DD27880",
   "distance": 100
  }
 ],
 "id": "overlay_4383EE65_7176_D7C2_41D4_BA084B8FC1AA",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -0.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -13,
   "hfov": 12.24
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6370B080_7096_4B42_41D9_370F8B14B57A, this.camera_3073FE63_70BD_D7C5_41D6_89AD2D634DC8); this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "items": [
  {
   "pitch": -13,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -0.63,
   "hfov": 12.24,
   "image": "this.AnimatedImageResource_686554E9_709E_34C2_41D6_18DE6D2FA3A9",
   "distance": 100
  }
 ],
 "id": "overlay_64FEC228_708A_4F42_41BD_D48DA5832BC4",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -143.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -26.82,
   "hfov": 11.21
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769, this.camera_306DDE4D_70BD_D7C2_41CD_D6EFB18E5D1E); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "items": [
  {
   "pitch": -26.82,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -143.32,
   "hfov": 11.21,
   "image": "this.AnimatedImageResource_686684E9_709E_34C2_41CE_0E149ACB843F",
   "distance": 100
  }
 ],
 "id": "overlay_63371978_7096_3DC2_4193_488EFAD729E2",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 24.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -14.01,
   "hfov": 12.19
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB, this.camera_330E8F64_70BD_D5C2_41CF_29EAC82FAE70); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "items": [
  {
   "pitch": -14.01,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 24.49,
   "hfov": 12.19,
   "image": "this.AnimatedImageResource_6F02C7BE_70B6_54BE_41DB_AB9B2581BEA9",
   "distance": 100
  }
 ],
 "id": "overlay_695AA5E3_708A_54C6_41D3_EB678C336EF6",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -158.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -14.26,
   "hfov": 12.17
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_63A7101A_7097_CB46_41D7_223F644A8390, this.camera_331E1F7B_70BD_D5C6_41D4_D9AC036040D8); this.mainPlayList.set('selectedIndex', 22)"
  }
 ],
 "items": [
  {
   "pitch": -14.26,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -158.9,
   "hfov": 12.17,
   "image": "this.AnimatedImageResource_6F02A7BE_70B6_54BE_41A9_2303CB4EA4A4",
   "distance": 100
  }
 ],
 "id": "overlay_6962A658_708A_77C2_41D7_01E38BBB5B02",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 31.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -27.82,
   "hfov": 11.11
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E81D499_709D_CB42_419F_6987EF427CA1, this.camera_30B15D66_70BD_D5CF_41D8_083D772A002A); this.mainPlayList.set('selectedIndex', 37)"
  }
 ],
 "items": [
  {
   "pitch": -27.82,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 31.53,
   "hfov": 11.11,
   "image": "this.AnimatedImageResource_469C5D6D_708A_35C2_41B0_2606B59B6518",
   "distance": 100
  }
 ],
 "id": "overlay_5B98D408_7196_4B42_41CF_6C85448FBC1E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -126.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -29.58,
   "hfov": 10.92
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E84A534_709D_D543_41D1_6DF91ACE6731, this.camera_30A1DD55_70BD_D5C2_41BC_31A164512217); this.mainPlayList.set('selectedIndex', 35)"
  }
 ],
 "items": [
  {
   "pitch": -29.58,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -126.24,
   "hfov": 10.92,
   "image": "this.AnimatedImageResource_469CDD6E_708A_35DE_41D0_5CDAA61598F8",
   "distance": 100
  }
 ],
 "id": "overlay_5D39020F_718A_4F5E_41D1_BFE3FA487C55",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 89.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -29.33,
   "hfov": 10.95
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E, this.camera_356FA17A_70BD_CDC6_41AE_80C6C5FA2D29); this.mainPlayList.set('selectedIndex', 31)"
  }
 ],
 "items": [
  {
   "pitch": -29.33,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 89.06,
   "hfov": 10.95,
   "image": "this.AnimatedImageResource_4681AD6A_708A_35C6_419D_A1D86F929FBD",
   "distance": 100
  }
 ],
 "id": "overlay_55D25EE0_718A_34C2_41D9_E673A071A980",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -75.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -43.4,
   "hfov": 9.13
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3, this.camera_3519616F_70BD_CDDE_41A8_0FE585D821FA); this.mainPlayList.set('selectedIndex', 29)"
  }
 ],
 "items": [
  {
   "pitch": -43.4,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -75.74,
   "hfov": 9.13,
   "image": "this.AnimatedImageResource_4681CD6A_708A_35C6_41D6_DF6D63586540",
   "distance": 100
  }
 ],
 "id": "overlay_545EF17F_718E_4DBE_41D5_AE2A1464714A",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 90.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -34.61,
   "hfov": 18.2
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911, this.camera_3351CFC4_70BD_D4C2_41BA_C215963EFBB6); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "items": [
  {
   "pitch": -34.61,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 90.06,
   "hfov": 18.2,
   "image": "this.AnimatedImageResource_687854E7_709E_34CE_41C6_2196F7197BA0",
   "distance": 100
  }
 ],
 "id": "overlay_7E1CFA60_70FA_3FC2_41D7_E736A0EADDEB",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -86.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -14.63,
   "hfov": 17.02
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214, this.camera_3343CFB2_70BD_D546_41D2_FD1D11AA0570); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "items": [
  {
   "pitch": -14.63,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -86.8,
   "hfov": 17.02,
   "image": "this.AnimatedImageResource_6879A4E7_709E_34CE_41D0_37084E335D71",
   "distance": 100
  }
 ],
 "id": "overlay_7FC29BAD_70F6_3D42_41D5_68D0761C19E1",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 52.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -25.06,
   "hfov": 11.38
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA75E31_709D_D742_418F_DBE20FF3106F, this.camera_31CE7C85_70BD_DB42_41B9_4F4AE37AAA4F); this.mainPlayList.set('selectedIndex', 32)"
  }
 ],
 "items": [
  {
   "pitch": -25.06,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 52.88,
   "hfov": 11.38,
   "image": "this.AnimatedImageResource_4680BD6B_708A_35C6_41A2_902176656F90",
   "distance": 100
  }
 ],
 "id": "overlay_54ACF435_718E_4B42_4199_4EC2C83D22B3",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -31.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -40.89,
   "hfov": 9.5
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA0CFB6_709A_354E_41D9_E6115D646438, this.camera_31FB6C6E_70BD_DBDC_41B6_C335952EC592); this.mainPlayList.set('selectedIndex', 30)"
  }
 ],
 "items": [
  {
   "pitch": -40.89,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -31.53,
   "hfov": 9.5,
   "image": "this.AnimatedImageResource_46815D6B_708A_35C6_41D6_F24A84494F95",
   "distance": 100
  }
 ],
 "id": "overlay_5972BBE5_718F_DCC2_41BA_04B2866902A7",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 17.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -14.32,
   "hfov": 12.17
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A857637_70FA_574E_41D2_791368B14100, this.camera_32D9006C_70BD_CBC2_41D5_E803E16B4B83); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "items": [
  {
   "pitch": -14.32,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 17.88,
   "hfov": 12.17,
   "image": "this.AnimatedImageResource_687B54E8_709E_34C2_41CF_4F877889A869",
   "distance": 100
  }
 ],
 "id": "overlay_626C85D8_708E_54C2_41CA_D97358219534",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -147.97,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -28.33,
   "hfov": 19.24
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A855791_70FA_7542_41D7_DE138FDB16FF, this.camera_3228907B_70BD_CBC6_41BA_1CC337D81F42); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "items": [
  {
   "pitch": -28.33,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -147.97,
   "hfov": 19.24,
   "image": "this.AnimatedImageResource_686484E8_709E_34C2_41D5_9A5F804725DC",
   "distance": 100
  }
 ],
 "id": "overlay_6324AEE0_708D_D4C3_4194_46C77A8EAB59",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 42.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -19.66,
   "hfov": 11.83
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9, this.camera_3328AF3D_70BD_D542_41D4_051AE221326B); this.mainPlayList.set('selectedIndex', 36)"
  }
 ],
 "items": [
  {
   "pitch": -19.66,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 42.33,
   "hfov": 11.83,
   "image": "this.AnimatedImageResource_469D4D6D_708A_35C2_41C0_5B6B63BE01CE",
   "distance": 100
  }
 ],
 "id": "overlay_58DE94BA_7196_4B46_41CA_6C22B3CD779C",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -82.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -32.09,
   "hfov": 10.64
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0, this.camera_33383F53_70BD_D5C6_41AB_440B819F8B2A); this.mainPlayList.set('selectedIndex', 34)"
  }
 ],
 "items": [
  {
   "pitch": -32.09,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -82.27,
   "hfov": 10.64,
   "image": "this.AnimatedImageResource_469C3D6D_708A_35C2_41DC_501EC6FCBE3B",
   "distance": 100
  }
 ],
 "id": "overlay_5B503B8F_7196_7D5E_41D3_60AD63F9D7B9",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -22.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 42,
      "height": 16
     }
    ]
   },
   "pitch": -12.78,
   "hfov": 11.06
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA, this.camera_3238A091_70BD_CB42_41B3_AA494C9310D2); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "items": [
  {
   "pitch": -12.78,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -22.07,
   "hfov": 11.06,
   "image": "this.AnimatedImageResource_6878A4E7_709E_34CE_41D9_E4FC02211363",
   "distance": 100
  }
 ],
 "id": "overlay_7E8F9E30_70FE_D742_41D6_9881FCAAA31E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 03c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 123.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -9.23,
   "hfov": 12.4
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F, this.camera_30381E13_70BD_D745_41D6_C6626D8932B0); this.mainPlayList.set('selectedIndex', 20)"
  }
 ],
 "items": [
  {
   "pitch": -9.23,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 123.22,
   "hfov": 12.4,
   "image": "this.AnimatedImageResource_6ADC527B_7097_CFC6_41D5_4F39F8A53C7B",
   "distance": 100
  }
 ],
 "id": "overlay_67752968_7095_DDC2_41D6_3C013AD6F0B3",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -161.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -1.44,
   "hfov": 12.56
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_63A7101A_7097_CB46_41D7_223F644A8390, this.camera_30087E25_70BD_D742_41D5_DE4A309F33D5); this.mainPlayList.set('selectedIndex', 22)"
  }
 ],
 "items": [
  {
   "pitch": -1.44,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -161.16,
   "hfov": 12.56,
   "image": "this.AnimatedImageResource_6ADCB27B_7097_CFC6_41D9_00B922357BEF",
   "distance": 100
  }
 ],
 "id": "overlay_67ADC820_7096_5B42_41BD_7C7E8CBA8774",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -99.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -2.59,
   "hfov": 19.92
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481, this.camera_301E6E3B_70BD_D745_41B1_1F2F5A6A7736); this.mainPlayList.set('selectedIndex', 23)"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 319,
      "height": 317
     }
    ]
   },
   "pitch": -2.59,
   "yaw": -99.94,
   "hfov": 19.92
  }
 ],
 "id": "overlay_68160695_708E_5742_41D8_1326885EAA1C",
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 62.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -13.86,
   "hfov": 12.2
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A855791_70FA_7542_41D7_DE138FDB16FF, this.camera_32CAC056_70BD_CBCE_41DB_88A8134F8A21); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "items": [
  {
   "pitch": -13.86,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 62.84,
   "hfov": 12.2,
   "image": "this.AnimatedImageResource_687944E8_709E_34C2_41D5_069C4E30D2A0",
   "distance": 100
  }
 ],
 "id": "overlay_603B25A8_708A_3542_41A6_9D3A2160F4BA",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -161.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -3.39,
   "hfov": 9.27
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214, this.camera_32FB2045_70BD_CBCD_41CD_5372B2B0BA0C); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "items": [
  {
   "pitch": -3.39,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -161.06,
   "hfov": 9.27,
   "image": "this.AnimatedImageResource_687A44E8_709E_34C2_41C8_4CCCAE5AC6DA",
   "distance": 100
  }
 ],
 "id": "overlay_602C714F_708E_4DDE_41D4_E3941653C3E5",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 1.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -18.78,
   "hfov": 11.89
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7, this.camera_33F44EF5_70BD_D4C2_41D5_4C50E1454CEC); this.mainPlayList.set('selectedIndex', 41)"
  }
 ],
 "items": [
  {
   "pitch": -18.78,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 1.63,
   "hfov": 11.89,
   "image": "this.AnimatedImageResource_4698BD70_708A_35C2_41C0_D114DD57D192",
   "distance": 100
  }
 ],
 "id": "overlay_40B7961A_717A_5747_41C4_6B6608C90285",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 174.6,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -27.4,
   "hfov": 9.14
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F, this.camera_33E4EEDF_70BD_D4FD_41DB_E09BEE7842A5); this.mainPlayList.set('selectedIndex', 39)"
  }
 ],
 "items": [
  {
   "pitch": -27.4,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 174.6,
   "hfov": 9.14,
   "image": "this.AnimatedImageResource_46972D70_708A_35C2_41D7_96AC0DE9471A",
   "distance": 100
  }
 ],
 "id": "overlay_43FF33EE_717A_4CDF_41D9_064EBA7A4F59",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 4.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -26.82,
   "hfov": 11.21
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93, this.camera_327C70C9_70BD_CCC2_41C0_CF84EE3CD445); this.mainPlayList.set('selectedIndex', 13)"
  }
 ],
 "items": [
  {
   "pitch": -26.82,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 4.15,
   "hfov": 11.21,
   "image": "this.AnimatedImageResource_468D3D63_708A_35C6_41CC_0D589B0C6951",
   "distance": 100
  }
 ],
 "id": "overlay_6CF08BE4_70BA_DCC2_41A7_C9C28B89ACFC",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -172.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -9.93,
   "hfov": 7.78
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868, this.camera_3242E0D5_70BD_CCC2_41D7_D9273AEBFC66); this.mainPlayList.set('selectedIndex', 11)"
  }
 ],
 "items": [
  {
   "pitch": -9.93,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -172.87,
   "hfov": 7.78,
   "image": "this.AnimatedImageResource_468D6D63_708A_35C6_41D5_E13937A5F184",
   "distance": 100
  }
 ],
 "id": "overlay_6C983CBC_70B5_DB42_41D6_4E8D3B114E8C",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -12.5,
   "hfov": 12.26
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B, this.camera_35F6B121_70BD_CD42_41CA_944B7A6FC0AA); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "items": [
  {
   "pitch": -12.5,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 26,
   "hfov": 12.26,
   "image": "this.AnimatedImageResource_468E7D62_708A_35C6_41B1_5D55B682B09D",
   "distance": 100
  }
 ],
 "id": "overlay_6CF3F2D4_70BA_CCC3_41D8_2AB59A652FB7",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 152.62,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -35.36,
   "hfov": 10.24
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB, this.camera_35E6B116_70BD_CD4F_41C8_4F7381CF16D8); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "items": [
  {
   "pitch": -35.36,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 152.62,
   "hfov": 10.24,
   "image": "this.AnimatedImageResource_468EBD63_708A_35C6_41D9_534ADB3EE0F0",
   "distance": 100
  }
 ],
 "id": "overlay_6C10E05B_70BA_4BC6_41B5_772499AB3AAF",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 7.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -21.92,
   "hfov": 14.22
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467, this.camera_33CABF1C_70BD_D542_41D2_E01E27BE1FFC); this.mainPlayList.set('selectedIndex', 19)"
  }
 ],
 "items": [
  {
   "pitch": -21.92,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 7.03,
   "hfov": 14.22,
   "image": "this.AnimatedImageResource_6867D4EA_709E_34C6_41DA_9269B52877A8",
   "distance": 100
  }
 ],
 "id": "overlay_657FD632_709A_7747_41B1_922AF7F89AFA",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -156.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -36.49,
   "hfov": 10.91
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6370B080_7096_4B42_41D9_370F8B14B57A, this.camera_33DA7F2C_70BD_D543_41D9_ABFD11244149); this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "items": [
  {
   "pitch": -36.49,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -156.13,
   "hfov": 10.91,
   "image": "this.AnimatedImageResource_686704EA_709E_34C6_41B2_43FF2B7C066F",
   "distance": 100
  }
 ],
 "id": "overlay_6682EF89_709B_D545_4190_8643637AB07E",
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c"
 }
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6879C4E7_709E_34CE_41DC_0B96368C18F1",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A85B95C_70FA_5DC2_41D8_7257BAFC3214_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_687914E7_709E_34CE_41D6_625AE8835B0A",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EAA5F4F_709A_75DE_41C1_CFCD62878722_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4685DD68_708A_35C2_419F_BD4371710882",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469B5D6E_708A_35DE_41C1_A01239035CCA",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E81D499_709D_CB42_419F_6987EF427CA1_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469BFD6E_708A_35DE_4193_23C754293A42",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468C5D64_708A_35C2_41C7_AE067C06808A",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A8B4222_70FB_CF46_41DA_140B27FC71B7_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468CFD64_708A_35C2_41D2_AB8DB7BA4D18",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6FFEBACC_709A_7CC3_41BE_0F2E7D8F89A4_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46844D68_708A_35C2_41AE_951B0C69039A",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4684DD68_708A_35C2_4161_B9908524F9FA",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E83AA35_709A_5F42_41D7_06AA41EE2758_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46836D69_708A_35C2_41BC_267BBCACB050",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6AAA3DEA_708E_34C7_41DA_9C4861BD3054",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_63A7101A_7097_CB46_41D7_223F644A8390_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6AA5FDEA_708E_34C7_41D2_649ADDC79BD9",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686614EA_709E_34C6_41BF_F6D268B3A1B5",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6370B080_7096_4B42_41D9_370F8B14B57A_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6867B4EA_709E_34C6_41AB_42A33D9ADA0F",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686084EA_709E_34C6_41D5_133D17124CF6",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_634E09ED_7096_3CC2_41CF_E2C408E0C467_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6ADD027A_7097_CFC6_41CA_79694A5B0ECD",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469A6D6E_708A_35DE_41D7_3BD7B59ED5D1",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469AED6F_708A_35DE_419E_5E5D57B0A880",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5F0E108E_71B6_4B5E_41B2_E664DE98A224_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46997D6F_708A_35DE_41D0_1B3A84FB15BA",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4696AD71_708A_35C2_41D1_A639811C3CFF",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5D95AC4A_71BB_DBC6_41C3_0266F7416D63_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31ADCC06_70BD_DB4E_41DA_96ECBEEFF68F",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4683ED69_708A_35C2_41C0_F9FF30B83AB2",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA0D158_709A_4DC3_4176_D18CCB3C7C6D_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46820D69_708A_35C2_41D1_0CB51219E096",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468D9D63_708A_35C6_41DB_3D971D6F6809",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A9CDA79_70FB_FFC2_41D6_A0BA1EFC0D93_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468C3D63_708A_35C6_41D5_F9180DC81E96",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686594E9_709E_34C2_41B1_ECE84728D62D",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7AA07DA1_70FA_5542_41C9_4E6BCE3F0769_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686524E9_709E_34C2_41D8_FAF2818CA26E",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_687BE4E8_709E_34C2_41CA_CBA5C9030704",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A855791_70FA_7542_41D7_DE138FDB16FF_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_687B24E8_709E_34C2_41D6_421084C95960",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46829D69_708A_35C5_41B1_5576301BEA8E",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E9DC865_709A_3BC2_41D8_F03675E9EDD3_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46812D6A_708A_35C6_41CA_BACCD5B5CA0D",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468B2D64_708A_35C2_41B9_C58E523065DC",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7AA2B997_70FB_DD4E_41C3_14377EAC6829_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468BBD64_708A_35C2_41C4_238996049F0B",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31A87C08_70BD_DB42_41D4_9DBB2EF45E11",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_42FC18E6_708A_DCCF_41D6_B24D30972695_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31A8FC08_70BD_DB42_4190_A9923A1F1EDE",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4680AD6B_708A_35C6_41D5_F408B9BE848B",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA75E31_709D_D742_418F_DBE20FF3106F_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469F2D6B_708A_35C6_41D5_A60DFB65D9A5",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469E5D6C_708A_35C2_41A0_F79AD8A9F337",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA79DAF_709D_F55D_41DA_A25D9DCDADB0_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469EED6C_708A_35C2_41B0_5237887473D2",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A8B610E_70FB_CD5F_41C7_178C81E87ABA_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468BDD64_708A_35C2_41A4_CD3745568A32",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4686CD67_708A_35CE_41D3_77BFFAA20465",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6F76ADB7_709A_554E_41D0_0B4BC4BA2752_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46854D68_708A_35C2_41D7_059999E7DB6C",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6F0217BE_70B6_54BE_41B0_2AD7924EAB62",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A84A3F5_70FB_CCC2_41CB_5BF1386862CB_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468FDD62_708A_35C6_41DC_26AF1B708B70",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686424E9_709E_34C2_41B8_46CEA6440040",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A857637_70FA_574E_41D2_791368B14100_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686454E9_709E_34C2_41C9_C47F2C274EF0",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469F4D6C_708A_35C2_41C1_2A870F4DBA29",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E87C5B8_709D_F542_41B9_2CB8BFCC9101_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469FCD6C_708A_35C2_41CD_11EA38D7AA03",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6ADD927B_7097_CFC6_41DB_A7C71D5D0803",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_63A4D12B_7097_CD46_41C3_4C67FDADE67F_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6ADDC27B_7097_CFC6_41C1_90055294ADF8",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4697BD71_708A_35C2_41D7_1878258EC101",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5F5C8C6F_717D_DBDE_41CB_50591234446B_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4697CD72_708A_35C6_41CE_111E5153B6CF",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46860D67_708A_35CE_41D3_AC0AF7925D5C",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6845D1D0_708E_CCC2_41D2_E2FF6AC26481_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46869D67_708A_35CE_41D2_927A6415A00A",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4699BD6F_708A_35DE_41D3_D87A18699831",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5EF6CDD8_71BA_74C2_41D2_264F5A15A54F_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46983D6F_708A_35DE_41B5_6CD06D3F3194",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31AF1C07_70BD_DB4E_41D1_05AAF70FA266",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_426D3250_708A_CFC2_41CE_A856A7F10E90_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_31AFEC07_70BD_DB4E_41CA_CB2526990B74",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4697BD70_708A_35C2_419D_3589C1BCCA5F",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5DF544A6_71BB_CB4E_41D4_E130C8A021E7_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46962D71_708A_35C2_41BE_FBD74DD27880",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686554E9_709E_34C2_41D6_18DE6D2FA3A9",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A85350B_70FA_3546_4180_3B2B0C2D3D1A_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686684E9_709E_34C2_41CE_0E149ACB843F",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6F02C7BE_70B6_54BE_41DB_AB9B2581BEA9",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7AA6EC9F_70FA_3B7E_41D6_7CE0C4702286_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6F02A7BE_70B6_54BE_41A9_2303CB4EA4A4",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469C5D6D_708A_35C2_41B0_2606B59B6518",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA74D01_709D_D542_41D0_5284F7CFAFC9_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469CDD6E_708A_35DE_41D0_5CDAA61598F8",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4681AD6A_708A_35C6_419D_A1D86F929FBD",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6EA0CFB6_709A_354E_41D9_E6115D646438_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4681CD6A_708A_35C6_41D6_DF6D63586540",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_687854E7_709E_34CE_41C6_2196F7197BA0",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A889237_70FA_4F4E_41D4_1E82FD63A4BA_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6879A4E7_709E_34CE_41D0_37084E335D71",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4680BD6B_708A_35C6_41A2_902176656F90",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E98E6F0_709D_D4C2_41CC_926FF50FAC8E_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46815D6B_708A_35C6_41D6_F24A84494F95",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_687B54E8_709E_34C2_41CF_4F877889A869",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A9D7EEB_70FA_74C6_41C5_771C878D9490_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686484E8_709E_34C2_41D5_9A5F804725DC",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469D4D6D_708A_35C2_41C0_5B6B63BE01CE",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6E84A534_709D_D543_41D1_6DF91ACE6731_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_469C3D6D_708A_35C2_41DC_501EC6FCBE3B",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7BC9F950_70FA_FDC2_41DA_CD97BCA46911_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 925,
   "height": 420
  }
 ],
 "frameCount": 30,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6878A4E7_709E_34CE_41D9_E4FC02211363",
 "colCount": 5
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6ADC527B_7097_CFC6_41D5_4F39F8A53C7B",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_6341E851_7097_DBC2_41B8_00401AC84CD8_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6ADCB27B_7097_CFC6_41D9_00B922357BEF",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "repeat": 1,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_687944E8_709E_34C2_41D5_069C4E30D2A0",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A9FA064_70FA_4BC2_41D1_F5ECFC761193_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_687A44E8_709E_34C2_41C8_4CCCAE5AC6DA",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_4698BD70_708A_35C2_41C0_D114DD57D192",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_5D9B4D12_71BA_3547_41BD_6C2E9D05D4B4_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_46972D70_708A_35C2_41D7_96AC0DE9471A",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468D3D63_708A_35C6_41CC_0D589B0C6951",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A84F2EA_70FB_CCC6_41D3_15C6561B4A5B_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468D6D63_708A_35C6_41D5_E13937A5F184",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468E7D62_708A_35C6_41B1_5D55B682B09D",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_7A9FEB55_70FB_DDC2_41D6_6ED2817EA868_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_468EBD63_708A_35C6_41D9_534ADB3EE0F0",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_6867D4EA_709E_34C6_41DA_9269B52877A8",
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "levels": [
  {
   "url": "media/panorama_63A50294_7096_4F42_41AB_F3EDD4DFCD9D_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_686704EA_709E_34C6_41B2_43FF2B7C066F",
 "colCount": 4
}],
 "gap": 10,
 "borderSize": 0,
 "backgroundPreloadEnabled": true,
 "paddingTop": 0,
 "class": "Player",
 "scrollBarWidth": 10,
 "mouseWheelEnabled": true,
 "vrPolyfillScale": 0.7,
 "paddingBottom": 0,
 "mobileMipmappingEnabled": false,
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "Player435"
 }
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
