package com.wagona.maths.model;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by sotsys-159 on 26/4/16.
 */
public class TestHistoryBean implements Serializable {

    private String test_id;
    private String user_id;
    private String student_id;
    private String score;
    private String test_number;
    private int score_percent;
    private String status;
    private String date_created;
    private String date_updated;
    private String elapsed_time_minutes;
    private String elapsed_time_seconds;
    private String subject_description;
    private String subject_id;
    private int num_topics;
    private int num_questions;
    private int num_correct;

    public String getTest_id() {
        return test_id;
    }

    public void setTest_id(String test_id) {
        this.test_id = test_id;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getStudent_id() {
        return student_id;
    }

    public void setStudent_id(String student_id) {
        this.student_id = student_id;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getTest_number() {
        return test_number;
    }

    public void setTest_number(String test_number) {
        this.test_number = test_number;
    }

    public int getScore_percent() {
        return score_percent;
    }

    public void setScore_percent(int score_percent) {
        this.score_percent = score_percent;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDate_created() {
        return date_created;
    }

    public void setDate_created(String date_created) {
        this.date_created = date_created;
    }

    public String getDate_updated() {
        return requriedDateFormate(date_updated);
    }

    private String requriedDateFormate(String from_date) {

        String inputPattern = "yyyy-MM-dd hh:mm:ss";
        String outputPattern = "dd MMMM, yyyy (hh:mm a)";
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


    public void setDate_updated(String date_updated) {
        this.date_updated = date_updated;
    }

    public String getElapsed_time_minutes() {
        return elapsed_time_minutes;
    }

    public void setElapsed_time_minutes(String elapsed_time_minutes) {
        this.elapsed_time_minutes = elapsed_time_minutes;
    }

    public String getElapsed_time_seconds() {
        return elapsed_time_seconds;
    }

    public void setElapsed_time_seconds(String elapsed_time_seconds) {
        this.elapsed_time_seconds = elapsed_time_seconds;
    }

    public String getSubject_description() {
        return subject_description;
    }

    public void setSubject_description(String subject_description) {
        this.subject_description = subject_description;
    }

    public String getSubject_id() {
        return subject_id;
    }

    public void setSubject_id(String subject_id) {
        this.subject_id = subject_id;
    }

    public int getNum_topics() {
        return num_topics;
    }

    public void setNum_topics(int num_topics) {
        this.num_topics = num_topics;
    }

    public int getNum_questions() {
        return num_questions;
    }

    public void setNum_questions(int num_questions) {
        this.num_questions = num_questions;
    }

    public int getNum_correct() {
        return num_correct;
    }

    public void setNum_correct(int num_correct) {
        this.num_correct = num_correct;
    }
}
