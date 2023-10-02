package com.wagona.maths.model;

/**
 * Created by sotsys-159 on 6/5/16.
 */
public class QuestionsBean {

    private String topic_id;
    private String description;
    private String topic_description;
    private String question_id;
    private String quest_image;
    private String quest_description;
    private String option_text_a;
    private String option_text_b;
    private String option_text_c;
    private String option_text_d;
    private String option_text_e;
    private String quest_answer;
    private String miscon;
    private int status;
    private String questions_taken;
    private String ng;
    private String quest_type;
    private String user_answer;
    private String answerMathHtml;


    /**
     * This params is not in Response still its needy for show data in screen
     */
    private boolean attend = false;
    private String attendAns = "X";

    public String getUserAnswer() {
        return user_answer;
    }

    public void setUser_answer(String user_answer) {
        this.user_answer = user_answer;
    }

    public boolean isAttend() {
        return attend;
    }

    public void setAttend(boolean attend) {
        this.attend = attend;
    }

    public String getAttendAns() {
        return attendAns;
    }

    public void setAttendAns(String attendAns) {
        this.attendAns = attendAns;
    }

    public String getTopic_id() {
        return topic_id;
    }

    public void setTopic_id(String topic_id) {
        this.topic_id = topic_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTopic_description() {
        return topic_description;
    }

    public void setTopic_description(String topic_description) {
        this.topic_description = topic_description;
    }

    public String getQuestion_id() {
        return question_id;
    }

    public void setQuestion_id(String question_id) {
        this.question_id = question_id;
    }

    public String getQuest_image() {
        return quest_image;
    }

    public void setQuest_image(String quest_image) {
        this.quest_image = quest_image;
    }

    public String getQuest_description() {
        return quest_description;
    }

    public void setQuest_description(String quest_description) {
        this.quest_description = quest_description;
    }

    public String getFillQuestion() {

        return option_text_a;
    }

    public String getOptionTextA() {


        return removeHtmlTags(option_text_a);
    }


    public String getOptionTextB() {
        return removeHtmlTags(option_text_b);
    }



    public String getOptionTextC() {

        return removeHtmlTags(option_text_c);

    }


    public String getOptionTextD() {
        return removeHtmlTags(option_text_d);
    }


    public String getOptionTextE() {
        return removeHtmlTags(option_text_e);
    }


    public String getQuestAnswer() {
        return quest_answer;
    }


    public String getMiscon() {
        return miscon;
    }


    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getQuestionsTaken() {
        return questions_taken;
    }


    public String getNg() {
        return ng;
    }

    public void setNg(String ng) {
        this.ng = ng;
    }


    /**
     * This method is used to remove un nessasory HTML tags from response
     */
    private String removeHtmlTags(String responseString) {

       // String cleanHtmlString = "";

        if (responseString==null)
            return responseString;

        if(responseString.contains("<p>")){
            responseString=responseString.replace("<p>","<span>");
        }
        if(responseString.contains("</p>")){
            responseString=responseString.replace("</p>","</span>");
        }

        if(responseString.contains("<br />")){
            responseString=responseString.replace("<br />","");
        }

        if(responseString.contains("&nbsp;")){
            responseString=responseString.replace("&nbsp;","");
        }


        return responseString;

    }

    public String getQuestionType() {
        return quest_type;
    }

    public String getAnswerMathHtml() {
        return answerMathHtml;
    }

    public void setAnswerMathHtml(String answerMathHtml) {
        this.answerMathHtml = answerMathHtml;
    }
}
