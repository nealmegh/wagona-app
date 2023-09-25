package com.wagona.maths.Utils;

import android.content.Context;
import android.content.SharedPreferences;


import android.content.Context;
import android.content.SharedPreferences;

/**
 * SessionManagerVie : Manage your local primitive data using SharedPreferences
 */
    /* =================================================================== */
public class SessionManagerWagona {
    private SharedPreferences objPreferences;
    private SharedPreferences.Editor objEditor;
    private Context objContext;
    private int PRIVATE_MODE = 0;
    private String PREF_NAME = "Viemate";

    public SessionManagerWagona(Context context) {
        this.objContext = context;
        objPreferences = objContext.getSharedPreferences(PREF_NAME, PRIVATE_MODE);
    }

    /**
     * setBooleanDetail : set Boolean value into SP
     */
    public void setBooleanDetail(String key, Boolean value) {
        objEditor = objPreferences.edit();
        objEditor.putBoolean(key, value);
        objEditor.commit();
    }

    /**
     * getBooleanDetail : get Boolean value from SP
     */
    public boolean getBooleanDetail(String key) {
        objEditor = objPreferences.edit();
        boolean status = objPreferences.getBoolean(key, false);
        objEditor.commit();
        return status;
    }

    /**
     * setIntDetail : set int value into SP
     */
    public void setIntDetail(String key, Boolean value) {
        objEditor = objPreferences.edit();
        objEditor.putBoolean(key, value);
        objEditor.commit();
    }

    /**
     * getIntDetail : get int value from SP
     */
    public int getIntDetail(String key) {
        objEditor = objPreferences.edit();
        int status = objPreferences.getInt(key, 0);
        objEditor.commit();
        return status;
    }

    /**
     * setStringDetail : set String value into SP
     */
    public void setStringDetail(String key, String value) {
        objEditor = objPreferences.edit();
        objEditor.putString(key, value);
        objEditor.commit();
    }

    /**
     * getStringDetail : get String value from SP
     */
    public String getStringDetail(String key) {
        objEditor = objPreferences.edit();
        String status = objPreferences.getString(key, "");
        objEditor.commit();
        return status;
    }

    /**
     * clearAllSP : clear your SP
     */
    public void clearAllSP() {
        objEditor = objPreferences.edit();
        objEditor.clear();
        objEditor.commit();
    }
}
