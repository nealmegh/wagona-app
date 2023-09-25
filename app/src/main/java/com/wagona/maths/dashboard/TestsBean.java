package com.wagona.maths.dashboard;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by sotsys-159 on 26/4/16.
 */
public class TestsBean implements Serializable{

    private String test;
    private String score;
    private String tcount;
    private String date;
    private String test_id;

    public String getTest_id() {
        return test_id;
    }

    public void setTest_id(String test_id) {
        this.test_id = test_id;
    }

    public String getDate() {

        if(!date.equalsIgnoreCase("Pending")){

            return  requriedDateFormate(date);

        }
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTest() {
        return test;
    }

    public void setTest(String test) {
        this.test = test;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getTcount() {
        return tcount;
    }

    public void setTcount(String tcount) {
        this.tcount = tcount;
    }


    private String requriedDateFormate(String from_date) {

        String inputPattern = "dd/mm/yy";
        String outputPattern = "dd MMMM,yyyy";
        SimpleDateFormat inputFormat = new SimpleDateFormat(inputPattern);
        SimpleDateFormat outputFormat = new SimpleDateFormat(outputPattern);

        Date date = null;
        String str = null;

        try {
            date = inputFormat.parse(from_date);
            str = outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return str;

    }
}
