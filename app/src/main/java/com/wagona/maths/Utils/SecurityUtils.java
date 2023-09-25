package com.wagona.maths.Utils;

import android.util.Log;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Random;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;


public class SecurityUtils implements AppParameter {


    public static String getCurrentTimeStamp() {
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
        String currentTimeStamp = dateFormat.format(new Date()); // Find todays
        return currentTimeStamp;
    }

    /* =================================================================== */
    /*
     * generateNonce : return nonce for webservice
     */
    /* =================================================================== */

    public static String generateNonce() {
        String nonce = "";
        Random rnd = new Random();
        int numLetters = 6;
        String randomLetters = RANDOM_CHARACTER;
        for (int n = 0; n < numLetters; n++)
            nonce = nonce + randomLetters.charAt(rnd.nextInt(randomLetters.length()));

        return nonce;
    }

    /* =================================================================== */
    /*
     * getTokan : return tokan for webservice
     */
    /* =================================================================== */

    public static String getTokan(String nonce, String timestamp) {
        String Url = "nonce=" + nonce + "&timestamp=" + timestamp;
        String SecretUrl = Url + "|" + SECRETE_KEY;
        return GetTokenForURl(SecretUrl);
    }

     /* =================================================================== */
     /*
     * GetTokenForURl : returns hash for webservice
     */
     /* =================================================================== */

    public static String GetTokenForURl(String Data) {


        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(PRIVATE_KEY.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte byteData[] = sha256_HMAC.doFinal(Data.getBytes());
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < byteData.length; i++) {
                sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
            }
            String hash = sb.toString();

            return hash;

        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }


    public static Map<String,String> setSecureParams(Map<String,String> params) {

        String nonce="456852";
        String timeStamp=SecurityUtils.getCurrentTimeStamp();

        String hash=getTokan("456852",timeStamp);


        params.put(NONCE, "456852");
        params.put(TIMESTAMP, timeStamp);
        params.put(TOKEN,hash);



        /*params.put(NONCE, "456852");
        params.put(TIMESTAMP, "1460696338");
        params.put(TOKEN,"4b8eb9daa1d7af26114eec90500dbd422a4f9fdd154114aa5c1fc8f3e182c8fb");*/




        return params;

    }
}