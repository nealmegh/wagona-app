package com.wagona.maths.Utils;

/**
 * Created by sotsys-159 on 21/4/16.
 */
public interface AppParameter {

    //
    public static final String DATE_FORMAT = "yyyyMMddHHmmss";
    public static final String RANDOM_CHARACTER = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    public static String PRIVATE_KEY = "dc834dbb55419dd56cd3827b0f2130f0";
    public static String SECRETE_KEY = "wagona_maths";


    static String NONCE = "nonce";
    static String TIMESTAMP = "timestamp";
    static String TOKEN = "token";

    static String FORGOT_PASSWORD = "forgotpassword";
    static String SCHOOL_SIGNUP = "school_signUp";
    static String LOGIN = "login";
    static String STUDENT_SIGNUP = "student_signUp";

    static String GET_ASSIGMENTS = "assignments";
    static String ASSIGMENTS_HISTORY = "assignment_history";
    static String HEADER_ID = "header_id";
    static String TAKE_ASSIGMENTS = "assignment_take";
    static String ASSIGNMWNT_COUNT = "get_remaining_assignment";
    static String ASSIGNMENT_SUBMIT = "assignment_check";
    static String GET_QUESTION_STRUCTURE = "getQuestionStructure";
    static String GET_MYTEST = "getMyTest";
    static String GET_CHECK_LATEST = "getCheckTopics";
    static String GET_MYTEST_LATEST = "getMyTestlatest";

    static String GET_SUBJECTS = "get_subjects";
    static String GET_COUNTRY = "get_country";
    static String GET_SYLLABUS = "get_syllabus";

    static String GETTESTDETAILBYTESTID = "gettestDetailBytestid";

    static String EDIT_PROFILE = "editProfile";
    static String GET_SOCIALLINKS = "getsociallinks";

    static String CONTACT_US = "contact_us";

    static String GENERATE_RESULT = "generate_result";

    static String PREMIUM_FLAG = "getChangePremiumflag";

    static String GET_PAYMENT_TYPES = "get_payment_types";

    //
    static String SEND_IMFORM_PAYMENT = "get_payment_types";


    static String PAYMENT_CHECK_URL = "https://wagona.com/webservices/upgrade_account";
    static String PAYMENT_CHECK_URL_PAYNOW = "http://dev.w3ondemand.com/development/wagona/site/upgrade_account";
    static String CANCEL_PAYMENT_CHECK_URL = " https://wagona.com/site/cancelsubscription";


    /**
     * PARAMETER for api
     **/

    static String SCHOOL_NAME = "school_name";
    static String ADDRESS_1 = "address_1";
    static String ADDRESS_2 = "address_2";
    static String ADDRESS_3 = "address_3";
    static String ADMIN_CONTACT = "admin_contact";
    static String TELEPHONE_NUM = "telephone_num";
    static String CELLPHONE_NUM = "cellphone_num";
    static String WEBSITE_URL = "website_url";
    static String NUM_STUDENTS = "num_students";
    static String EMAIL_ADDRESS = "email_address";
    static String PASSWORD = "password";
    static String CONFIRM_PASSWORD = "confirm_password";
    static String TYPE = "type";
    static String TOPIC_ID = "topic_id";
    static String USER_ID = "user_id";
    static String EMAIL = "email";
    static String VDEVICETOKEN = "vDeviceToken";
    static String EPLATFORM = "ePlatform";
    static String FNAME = "fname";
    static String SNAME = "sname";
    static String MOBILE_NO = "mobile_no";
    static String SUBJECT_ID = "subject_id";
    static String COUNTRY_ID = "country_id";
    static String SYLLABUS_ID = "syllabus_id";
    static String VDEVICEVERSION = "vDeviceVersion";
    static String VDEVICENAME = "vDeviceVersion";
    static String IBADGECOUNT = "iBadgeCount";

    static String OLD_PASSWORD = "old_password";
    static String NEW_PASSWORD = "new_password";

    static String PERSON_NAME = "person_name";
    static String PERSON_EMAIL = "person_email";
    static String MOBILE_NUMBER = "mobile_number";
    static String SUBJECT = "subject";
    static String TX_MESSAGE = "tx_message";

    static String REMEMBER_ME = "remember_me";


    //response params
    static String STUDENT_ID = "student_id";
    static String ACCOUNT_ID = "account_id";

    static String MESSAGE = "message";
    static String SCHOOL_ID = "school_id";
    static String FIRSTNAME = "firstname";
    static String SURNAME = "surname";
    static String USERNAME = "username";
    static String PARENT_EMAIL = "parent_email";
    static String PARENT_PHONE_NUM = "parent_phone_num";
    static String CLASS_ID = "class_id";
    static String VPROFILEIMAGE = "vProfileImage";
    static String VMOBILENUMBER = "vMobileNumber";
    static String STATUS = "status";
    static String CREATED_AT = "created_at";
    static String UPDATED_AT = "updated_at";
    static String RESULT = "result";
    static String IMAGEPATH = "imagePath";


    //database fileds
    static String JSON_DATA = "json_data";
    static String USER_TABLE = "User";
    static String ID = "id";


    static String DASHBOARD_TABLE = "Dashboard";
    static String HISTORY_TABLE = "History";

    static String TESTDETAILS_TABLE = "Testdetails";
    static String CALLTIME_TABLE = "CallTime";


    static String API_NAME = "api_name";

    static String TEST_ID = "test_id";


    static String PAYMENT_STATUS = "payment_status";


}
