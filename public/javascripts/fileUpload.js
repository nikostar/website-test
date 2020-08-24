FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )
  
  FilePond.setOptions({
    stylePanelAspectRatio: 75 / 50,
    imageResizeTargetWidth: 50,
    imageResizeTargetHeight: 75
  })
  
  FilePond.parse(document.body);