package com.wagona.maths.model;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by sotsys-159 on 26/4/16.
 */
public class TestDetails implements Serializable {

    private String subject_id;
    private String description;
    private ArrayList<TestsBean> tests = new ArrayList<>();
    private String average;
    private String grade="A";

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getAverage() {
        return average;
    }

    public void setAverage(String average) {
        this.average = average;
    }

    public String getSubject_id() {
        return subject_id;
    }

    public void setSubject_id(String subject_id) {
        this.subject_id = subject_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ArrayList<TestsBean> getTests() {
        return tests;
    }

    public void setTests(ArrayList<TestsBean> tests) {
        this.tests = tests;
    }
}
