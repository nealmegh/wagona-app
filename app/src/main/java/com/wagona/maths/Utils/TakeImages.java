package com.wagona.maths.Utils;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;

import com.soundcloud.android.crop.Crop;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;


public class TakeImages extends Activity
{

    private int RESULT_LOAD_IMAGE = 1;

    protected int CAMERA_REQUEST = 0, GALLERY_REQUEST = 100, CROP_CALL = 101;
    private Uri mCapturedImageURI;
    private String mediaPath;
    private String fileName;

    public static final String IMAGE_PATH = File.separator + "wagona" + File.separator + "Temp.png";

    public String getStorageDirectory(String path)
    {
        String rootDir = "";
        if (Environment.getExternalStorageState().equalsIgnoreCase(Environment.MEDIA_MOUNTED) && !Environment.getExternalStorageState().equalsIgnoreCase(Environment.MEDIA_MOUNTED_READ_ONLY))
        {
            rootDir = Environment.getExternalStorageDirectory().getAbsolutePath();
        }
        else
        {
            rootDir = getFilesDir().getAbsolutePath();
        }
        return rootDir + path;
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        mediaPath = getStorageDirectory(IMAGE_PATH);
        if (!new File(mediaPath).exists())
        {
            new File(mediaPath).mkdirs();
        }
        else
        {
            new File(mediaPath).delete();
        }
        startDialog();

    }

    public String GetCurrentTimeStamp()
    {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        String currentTimeStamp = dateFormat.format(new Date()); // Find todays
        // date

        return currentTimeStamp;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK && requestCode == GALLERY_REQUEST)
        {
            if (data != null)
            {
                callCropActivity(data);
            }
        }
        else if (requestCode == CAMERA_REQUEST && resultCode == RESULT_OK)
        {
            Uri destination = Uri.fromFile(new File(getCacheDir(), "cropped" + GetCurrentTimeStamp() + ".png"));
            Crop.of(mCapturedImageURI, destination).asSquare().start(this);

        }
        else if (resultCode == RESULT_OK && requestCode == Crop.REQUEST_CROP)
        {
            Uri mUri = Crop.getOutput(data);
            Intent intent = new Intent();
            intent.putExtra("image_url", mUri.getPath());
            setResult(RESULT_OK, intent);
            finish();


//            ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
//            NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
//
//
//            if (activeNetworkInfo == null)
//            {
//
//                AlertDialog.Builder adb = new AlertDialog.Builder(this);
//                adb.setTitle(getSpanWithCustomFont(getResources().getString(R.string.app_name)));
//                adb.setMessage(getSpanWithCustomFont("Your Internet connection is not enable."));
//                adb.setPositiveButton(getSpanWithCustomFont("Ok"), new AlertDialog.OnClickListener()
//                {
//
//                    @Override
//                    public void onClick(DialogInterface dialog, int which)
//                    {
//                        dialog.dismiss();
//                        finish();
//                    }
//                });
//                adb.show();
//
//
//            }
//            else
//            {
//                Uri mUri = Crop.getOutput(data);
//                Intent intent = new Intent();
//                intent.putExtra("image_url", mUri.getPath());
//                setResult(RESULT_OK, intent);
//                finish();
//
//            }
        }
        else
        {
            finish();
        }

    }

    private void callCropActivity(Intent data)
    {
        Uri destination = Uri.fromFile(new File(getCacheDir(), "cropped" + GetCurrentTimeStamp() + ".png"));
        Crop.of(data.getData(), destination).asSquare().start(this);
    }


    private void startDialog()
    {
        sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse("file://" + Environment.getExternalStorageDirectory())));
        AlertDialog.Builder myAlertDialog = new AlertDialog.Builder(this);
        myAlertDialog.setTitle("Upload Pictures");
        myAlertDialog.setMessage("Select a picture to upload.");
        myAlertDialog.setPositiveButton("Gallery", new DialogInterface.OnClickListener()
        {

            public void onClick(DialogInterface dialogInterface, int i)
            {
                Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(intent, GALLERY_REQUEST);
            }
        });

        myAlertDialog.setNegativeButton("Camera", new DialogInterface.OnClickListener()
        {

            public void onClick(DialogInterface dialogInterface, int i)
            {

                Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                mCapturedImageURI = getOutputMediaFileUri();
                intent.putExtra(MediaStore.EXTRA_OUTPUT, mCapturedImageURI);
                intent.putExtra("return-data", true);
                startActivityForResult(intent, CAMERA_REQUEST);


            }
        });

        myAlertDialog.setOnCancelListener(new DialogInterface.OnCancelListener()
        {

            @Override
            public void onCancel(DialogInterface dialog)
            {
                finish();
            }
        });
        myAlertDialog.show();
    }

    public Uri getOutputMediaFileUri()
    {


        return Uri.fromFile(getOutputMediaFile());
    }

    private File getOutputMediaFile()
    {

        // External sdcard location
        File mediaStorageDir = new File(mediaPath);

        // Create the storage directory if it does not exist
        if (!mediaStorageDir.exists())
        {

            mediaStorageDir.mkdirs();
        }

        // Create a media file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        File mediaFile;

        mediaFile = new File(mediaStorageDir.getPath() + File.separator + "IMG_" + timeStamp + ".jpg");


        return mediaFile;
    }

    protected void onSaveInstanceState(Bundle outState)
    {
        super.onSaveInstanceState(outState);
        // save file url in bundle as it will be null on scren orientation changes
        outState.putParcelable("file_uri", mCapturedImageURI);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState)
    {
        super.onRestoreInstanceState(savedInstanceState);
        // get the file url
        mCapturedImageURI = savedInstanceState.getParcelable("file_uri");
    }
}