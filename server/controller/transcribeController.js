const { supabase } = require('./../supabaseClient');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// For Buffer Storage
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Not an audio file! Please upload an audio file.', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadAudio = upload.array('audio', 4); // max 4 audio files

exports.handleAudioUpload = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError('No Audio file uploaded', 400));
  }

  const uploadedFiles = [];

  for (const file of req.files) {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `audio-${Date.now()}.${fileExt}`;
    const filePath = `audio/${fileName}`;

    // Store file in supabase
    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype
      });

    if (uploadError) {
      console.log('Upload Error:', uploadError.message);
      continue;
    }

    const { error: dbError } = await supabase
      .from('Transcription')
      .insert([{ filename: fileName }]);

    if (dbError) {
      console.log('DB Error:', dbError.message);
      continue;
    }

    uploadedFiles.push(fileName);
  }

  res.status(200).json({
    status: 'success',
    data: {
      files: uploadedFiles
    }
  });
});
