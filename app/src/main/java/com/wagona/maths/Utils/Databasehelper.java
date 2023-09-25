package com.wagona.maths.Utils;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.database.sqlite.SQLiteOpenHelper;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class Databasehelper extends SQLiteOpenHelper implements AppParameter {

    @SuppressLint("SdCardPath")
    private static String DB_PATH = "/data/data/com.wagona.maths/databases/";
    static String DB_NAME = "wagona_local.sqlite";
    private SQLiteDatabase myDataBase;
    private final Context myContext;


    static String ASSIGNMENT_TABLE = "Assignments";
    static String HISTORY_TABLE_ASSIGNMENT = "Historyassignment";

    public Databasehelper(Context context) {
        super(context, DB_NAME, null, 1);
        this.myContext = context;
    }

    /**
     * Creates a empty database on the system and rewrites it with your own
     * database.
     */
    public void createDataBase() throws IOException {

        boolean dbExist = checkDataBase();
        myDataBase = null;

        if (dbExist) {
            // do nothing - database already exist
        } else {
            // By calling this method and empty database will be created into
            // the default system path
            // of your application so we are gonna be able to overwrite that
            // database with our database.]

            myDataBase = this.getReadableDatabase();
            myDataBase.close();
            try {
                copyDataBase();

            } catch (IOException e) {
                throw new Error("Error copying database");
            }
        }

    }

    /**
     * Check if the database already exist to avoid re-copying the file each
     * time you open the application.
     *
     * @return true if it exists, false if it doesn't
     */
    private boolean checkDataBase() {
        SQLiteDatabase checkDB = null;
        try {

            String myPath = DB_PATH + DB_NAME;

            File file = new File(myPath);
            if (file.exists() && !file.isDirectory())
            checkDB = SQLiteDatabase.openDatabase(myPath, null, SQLiteDatabase.OPEN_READWRITE);
        } catch (SQLiteException e) {
            // database does't exist yet.
        }

        if (checkDB != null) {
            checkDB.close();
        }

        return checkDB != null ? true : false;
    }

    /**
     * Copies your database from your local assets-folder to the just created
     * empty database in the system folder, from where it can be accessed and
     * handled. This is done by transfering bytestream.
     */

    private void copyDataBase() throws IOException {
        // Open your local db as the input stream
        InputStream myInput = myContext.getAssets().open(DB_NAME);

        // Path to the just created empty db
        String outFileName = DB_PATH + DB_NAME;

        // Open the empty db as the output stream
        OutputStream myOutput = new FileOutputStream(outFileName);

        // transfer bytes from the inputfile to the outputfile
        byte[] buffer = new byte[1024];
        int length;
        while ((length = myInput.read(buffer)) > 0) {
            myOutput.write(buffer, 0, length);
        }
        myOutput.flush();
        myOutput.close();
        myInput.close();

    }

    public void openDataBase() throws SQLException {
        // Open the database
        String myPath = DB_PATH + DB_NAME;
        myDataBase = SQLiteDatabase.openDatabase(myPath, null, SQLiteDatabase.OPEN_READWRITE);
    }

    @Override
    public synchronized void close() {
        if (myDataBase != null)
            myDataBase.close();
        super.close();
    }

    @Override
    public void onCreate(SQLiteDatabase arg0) {
        // TODO Auto-generated method stub

    }

    @Override
    public void onUpgrade(SQLiteDatabase arg0, int arg1, int arg2) {
        // TODO Auto-generated method stub

    }

    public void insertUserInfo(String user_id, String email, String password, String response) {

        ContentValues initialValues = new ContentValues();
        initialValues.put(USER_ID, user_id);
        initialValues.put(JSON_DATA, response);
        initialValues.put(EMAIL_ADDRESS, email);
        initialValues.put(PASSWORD, password);

        if (checkForID(user_id)) {

            myDataBase.update(USER_TABLE, initialValues, USER_ID + "='" + user_id + "'", null);

        } else {
            myDataBase.insert(USER_TABLE, null, initialValues);
        }


    }

    private boolean checkForID(String UserID) {

        String uID = "";
        try {
            Cursor result = myDataBase.rawQuery("Select " + USER_ID + " from " + USER_TABLE + " where " + USER_ID + "='" + UserID + "'", null);

            if (result.moveToFirst()) {
                uID = result.getString(result.getColumnIndex(USER_ID));
                //System.out.println(idG + "---");
            }
        } catch (Exception e) {
            uID = "";
            e.printStackTrace();
        }
        if (uID.length() > 0) {
            return true;
        } else {
            return false;
        }

    }

    public String isLogin(String email, String password) {

        String response = "";

        Cursor mCursor = myDataBase.rawQuery("SELECT * FROM " + USER_TABLE + " Where " + EMAIL_ADDRESS + "='" + email + "' AND " + PASSWORD + "='" + password + "'", null);

        if (mCursor.getCount() != 0 && mCursor.moveToFirst()) {
            return mCursor.getString(mCursor.getColumnIndex(JSON_DATA));
        }

        return "";


    }

    public void insertDashBoardData(String response) {

        ContentValues initialValues = new ContentValues();

        initialValues.put(JSON_DATA, response);
        myDataBase.update(DASHBOARD_TABLE, initialValues, ID + "="+1+"", null);


    }

    public String getDashBoardData() {
        String response = "";

        Cursor mCursor = myDataBase.rawQuery("SELECT * FROM " + DASHBOARD_TABLE + " Where " + ID + "=" + 1 + "", null);

        if (mCursor.getCount() != 0 && mCursor.moveToFirst()) {
            return mCursor.getString(mCursor.getColumnIndex(JSON_DATA));
        }

        return "";

    }






    /*-------------------------Edit by reena kumawat 28 march 2018----------------------------------*/
   /* public void insertAssignment(String response) {

        ContentValues initialValues = new ContentValues();

        initialValues.put(JSON_DATA, response);
        myDataBase.update(ASSIGNMENT_TABLE, initialValues, ID + "="+1+"", null);


    }*/

    public void inserHistoryDataAssignment(String userID, String test_id, String jsonObjectData) {

        ContentValues initialValues = new ContentValues();
        initialValues.put(TEST_ID, test_id);
        initialValues.put(JSON_DATA, jsonObjectData);
        initialValues.put(USER_ID, userID);

        if (checkForTestIDAssignment(test_id)) {
            myDataBase.update(HISTORY_TABLE_ASSIGNMENT, initialValues, TEST_ID + "=" + test_id + "", null);

        } else {
            myDataBase.insert(HISTORY_TABLE_ASSIGNMENT, null, initialValues);
        }



    }

    /*public String getAssignments() {
        Cursor mCursor = myDataBase.rawQuery("SELECT * FROM " + ASSIGNMENT_TABLE + " Where " + ID + "=" + 1 + "", null);
        if (mCursor.getCount() != 0 && mCursor.moveToFirst()) {
            return mCursor.getString(mCursor.getColumnIndex(JSON_DATA));
        }
        return "";

    }*/

    private boolean checkForTestIDAssignment(String test_id) {

        String uID = "";
        try {
            Cursor result = myDataBase.rawQuery("Select " + TEST_ID + " from " + HISTORY_TABLE_ASSIGNMENT + " where " + TEST_ID + "=" + test_id + "", null);

            if (result.moveToFirst()) {
                uID = result.getString(result.getColumnIndex(TEST_ID));
                //System.out.println(idG + "---");
            }
        } catch (Exception e) {
            uID = "";
            e.printStackTrace();
        }
        if (uID.length() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public Cursor getAllHistoryDataAssignment(String userID) {

        Cursor mCursor = myDataBase.rawQuery("SELECT * FROM " + HISTORY_TABLE_ASSIGNMENT+" where "+USER_ID+"='"+userID+"' order by "+TEST_ID+" DESC", null);

        if (mCursor.getCount() != 0 && mCursor.moveToFirst()) {
            return mCursor;
        }

        return null;
    }


    public void insertTestDetailsAssignment(String test_id, String response) {

        ContentValues initialValues = new ContentValues();
        initialValues.put(TEST_ID, test_id);
        initialValues.put(JSON_DATA, response);

        if (checkForTestIDinDetailsAssignment(test_id)) {
            myDataBase.update(ASSIGNMENT_TABLE, initialValues, TEST_ID + "='" + test_id + "'", null);

        } else {
            myDataBase.insert(ASSIGNMENT_TABLE, null, initialValues);
        }
    }
    public boolean checkForTestIDinDetailsAssignment(String test_id) {

        String uID = "";
        try {
            Cursor result = myDataBase.rawQuery("Select " + TEST_ID + " from " + ASSIGNMENT_TABLE + " where " + TEST_ID + "='" + test_id + "'", null);

            if (result.moveToFirst()) {
                uID = result.getString(result.getColumnIndex(TEST_ID));
                //System.out.println(idG + "---");
            }
        } catch (Exception e) {
            uID = "";
            e.printStackTrace();
        }
        if (uID.length() > 0) {
            return true;
        } else {
            return false;
        }
    }


    public String getTestDetailsAssignment(String test_id) {

        String response = "";

        Cursor mCursor = myDataBase.rawQuery("SELECT * FROM " + ASSIGNMENT_TABLE + " Where " + TEST_ID + "=" + test_id+"", null);

        if (mCursor.getCount() != 0 && mCursor.moveToFirst()) {
            return mCursor.getString(mCursor.getColumnIndex(JSON_DATA));
        }

        return "";
    }




    /*--------------------------------------end-------------------------------*/






    public void inserHistoryData(String userID, String test_id, String jsonObjectData) {

        ContentValues initialValues = new ContentValues();
        initialValues.put(TEST_ID, test_id);
        initialValues.put(JSON_DATA, jsonObjectData);
        initialValues.put(USER_ID, userID);

        if (checkForTestID(test_id)) {
            myDataBase.update(HISTORY_TABLE, initialValues, TEST_ID + "=" + test_id + "", null);

        } else {
            myDataBase.insert(HISTORY_TABLE, null, initialValues);
        }



    }

    private boolean checkForTestID(String test_id) {

        String uID = "";
        try {
            Cursor result = myDataBase.rawQuery("Select " + TEST_ID + " from " + HISTORY_TABLE + " where " + TEST_ID + "=" + test_id + "", null);

            if (result.moveToFirst()) {
                uID = result.getString(result.getColumnIndex(TEST_ID));
                //System.out.println(idG + "---");
            }
        } catch (Exception e) {
            uID = "";
            e.printStackTrace();
        }
        if (uID.length() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public Cursor getAllHistoryData(String userID) {

        Cursor mCursor = myDataBase.rawQuery("SELECT * FROM " + HISTORY_TABLE+" where "+USER_ID+"='"+userID+"' order by "+TEST_ID+" DESC", null);

        if (mCursor.getCount() != 0 && mCursor.moveToFirst()) {
            return mCursor;
        }

        return null;
    }

    public void insertTestDetails(String test_id, String response) {

        ContentValues initialValues = new ContentValues();
        initialValues.put(TEST_ID, test_id);
        initialValues.put(JSON_DATA, response);

        if (checkForTestIDinDetails(test_id)) {
            myDataBase.update(TESTDETAILS_TABLE, initialValues, TEST_ID + "='" + test_id + "'", null);

        } else {
            myDataBase.insert(TESTDETAILS_TABLE, null, initialValues);
        }
    }
    public boolean checkForTestIDinDetails(String test_id) {

        String uID = "";
        try {
            Cursor result = myDataBase.rawQuery("Select " + TEST_ID + " from " + TESTDETAILS_TABLE + " where " + TEST_ID + "='" + test_id + "'", null);

            if (result.moveToFirst()) {
                uID = result.getString(result.getColumnIndex(TEST_ID));
                //System.out.println(idG + "---");
            }
        } catch (Exception e) {
            uID = "";
            e.printStackTrace();
        }
        if (uID.length() > 0) {
            return true;
        } else {
            return false;
        }
    }


    public String getTestDetails(String test_id) {

        String response = "";

        Cursor mCursor = myDataBase.rawQuery("SELECT * FROM " + TESTDETAILS_TABLE + " Where " + TEST_ID + "=" + test_id+"", null);

        if (mCursor.getCount() != 0 && mCursor.moveToFirst()) {
            return mCursor.getString(mCursor.getColumnIndex(JSON_DATA));
        }

        return "";
    }



    public String getLastTimestamp() {

        String response = "";

        Cursor mCursor = myDataBase.rawQuery("SELECT * FROM " + CALLTIME_TABLE + " Where " + ID + "=" + 3+"", null);

        if (mCursor.getCount() != 0 && mCursor.moveToFirst()) {
            return mCursor.getString(mCursor.getColumnIndex(TIMESTAMP));
        }

        return "";
    }

    public void setTimeStamp() {


        ContentValues initialValues = new ContentValues();
        initialValues.put(TIMESTAMP, (System.currentTimeMillis()/1000)+"");


            myDataBase.update(CALLTIME_TABLE, initialValues, ID + "='" + 3 + "'", null);




    }

    public void deleteAllTimeStamp() {

        ContentValues initialValues = new ContentValues();
        initialValues.put(TIMESTAMP, "0");
        myDataBase.update(CALLTIME_TABLE, initialValues, ID + "='" + 3 + "'", null);

    }
}
