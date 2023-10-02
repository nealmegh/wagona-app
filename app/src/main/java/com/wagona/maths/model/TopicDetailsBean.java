package com.wagona.maths.model;

import java.io.Serializable;

/**
 * Created by sotsys-159 on 27/4/16.
 */
public class TopicDetailsBean implements Serializable {

    private int is_paid;
    private String topic_id;
    private String student_id;
    private String class_id;
    private String num_questions;
    private String num_correct;
    private String moving_average;
    private String num_wrong;
    private String score;
    private String percentage;
    private String description;

    private boolean isChecked=false;

    public int getIs_paid() {
        return is_paid;
    }

    public void setIs_paid(int is_paid) {
        this.is_paid = is_paid;
    }

    public boolean isChecked() {
        return isChecked;
    }

    public void setChecked(boolean checked) {
        isChecked = checked;
    }

    public String getTopic_id() {
        return topic_id;
    }

    public void setTopic_id(String topic_id) {
        this.topic_id = topic_id;
    }

    public String getStudent_id() {
        return student_id;
    }

    public void setStudent_id(String student_id) {
        this.student_id = student_id;
    }

    public String getClass_id() {
        return class_id;
    }

    public void setClass_id(String class_id) {
        this.class_id = class_id;
    }

    public String getNum_questions() {
        return num_questions;
    }

    public void setNum_questions(String num_questions) {
        this.num_questions = num_questions;
    }

    public String getNum_correct() {
        return num_correct;
    }

    public void setNum_correct(String num_correct) {
        this.num_correct = num_correct;
    }

    public String getMoving_average() {
        return moving_average;
    }

    public void setMoving_average(String moving_average) {
        this.moving_average = moving_average;
    }

    public String getNum_wrong() {
        return num_wrong;
    }

    public void setNum_wrong(String num_wrong) {
        this.num_wrong = num_wrong;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getPercentage() {

        if(percentage.contains("%")){
            percentage=percentage.replace("%","");
        }
        return percentage;
    }

    public void setPercentage(String percentage) {
        this.percentage = percentage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
