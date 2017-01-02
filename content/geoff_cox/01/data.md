path: content/geoff_cox/01

----

content: 

----

index: 0

----

zoom: 0.8499999999999999

----

xPos: 20.59999999999996

----

yPos: -0.1999999999999994

----

wordSpace: 0

----

nbOfFiles: 1

----

text: <pre>
// tess.cpp:
// Recognize text on an image using Tesseract API and print it to the screen
// Usage: ./tess image.png

#include <tesseract/baseapi.h>
#include <tesseract/strngs.h>
#include <tesseract/resultiterator.h>
#include <leptonica/allheaders.h>
#include <iostream>
#include "opencv2/core/core.hpp"
#include "opencv2/features2d/features2d.hpp"
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include <QtCore/QString>

using namespace cv;

using namespace std;

int main(int argc, char** argv)
{
    if (argc < 2)
    {
        std::cout << "Please specify the input image!" << std::endl;
        return -1;
    }

    //    char *outText;
    int fontface = FONT_HERSHEY_SIMPLEX;
    tesseract::TessBaseAPI *api = new tesseract::TessBaseAPI();
    // Initialize tesseract-ocr with English, without specifying tessdata path
    if (api->Init(NULL, "deu")) {
        fprintf(stderr, "Could not initialize tesseract.\n");
        exit(1);
    }

    // Open input image with leptonica library
    Pix *image = pixRead(argv[1]);
    Mat im=imread(argv[1],CV_LOAD_IMAGE_COLOR);
    int icols=im.cols;
    int irows=im.rows;
    cv::Mat wim( irows, icols, im.type(), cv::Scalar(0));
    Rect letterRect;
    Mat src, dst, color_dst;
    int confidence_level=0;
    int j=0;
    src=imread(argv[1],CV_LOAD_IMAGE_GRAYSCALE);
    Canny(src, dst, 50, 200, 3 );
    cvtColor( dst, color_dst, CV_GRAY2BGR );
    vector<Vec4i> lines;
    HoughLinesP( dst, lines, 1, CV_PI/180, 80, 80, 10 );
    int numlines=0;
    for( size_t i = 0; i < lines.size(); i++ )
    {
        double Angle = atan2(lines[i][3]- lines[i][1], lines[i][2]- lines[i][0]) * 180.0 / CV_PI;
        if(Angle>=0 && Angle <=5){
            numlines++;
            line( color_dst, Point(lines[i][0], lines[i][1]),
                  Point(lines[i][2], lines[i][3]), Scalar(0,0,255), 3, 8 );
        }
    }
    if(numlines>40){
        //Mat screen=cvCreateMat(im.rows,im.cols,im.type());
        api->SetImage(image);
        api->Recognize(0);
        //outText = api->GetUTF8Text();
        tesseract::ResultIterator* ri = api->GetIterator();
        tesseract::PageIteratorLevel level = tesseract::RIL_SYMBOL;

        if (ri != 0) {
            do {
                const char* word = ri->GetUTF8Text(level);
                float conf = ri->Confidence(level);
                int x1, y1, x2, y2;
                ri->BoundingBox(level, &x1, &y1, &x2, &y2);
//                printf("word: '%s';  \tconf: %.2f; BoundingBox: %d,%d,%d,%d;\n",
//                       word, conf, x1, y1, x2, y2);
                bool ignore;
                int psize,fid;
                ri->WordFontAttributes(&ignore,&ignore,&ignore,&ignore,&ignore,&ignore,&psize,&fid);
                //            printf("point size: %d font id: %d",psize, fid);
                if(conf>50){
                    QString utfw = QString::fromUtf8(word);
//                    if(utfw.size()>4){
//               //         printf("word: '%s'  \tlength: %d\n",word,utfw.length());
                        letterRect=CvRect();
                        letterRect.x=x1;
                        letterRect.y=y1;
                        letterRect.width=(x2-x1);
                        letterRect.height=(y2-y1);
                        Mat letterim;
                        try{
                            letterim=im(letterRect).clone();
//                            im.copyTo(wim(Rect(letterRect.x, letterRect.y, letterRect.width, letterRect.height)));

                            cv::Rect roi( cv::Point( letterRect.x, letterRect.y), cv::Size( letterRect.width, letterRect.height));
//                            printf("x %d y %d width %d height %d \n",letterRect.x, letterRect.y,letterRect.width, letterRect.height);
//                            printf("cols %d rows %d\n",wim.cols,wim.rows);
                            cv::Mat destinationROI = wim( roi );
                            letterim.copyTo( destinationROI );
//                            QString qs = QString("words/word_%1_").arg(word);
//                            qs.append(QString("%1.jpg").arg(j));
//                            imwrite(qs.toStdString(),letterim);
                        }
                        catch( cv::Exception& e )
                        {
                            const char* err_msg = e.what();
//                            std::cout << "exception caught: " << err_msg << std::endl;
                        }
                        rectangle(wim,Point(x1, y1),Point(x2,y2),Scalar(255,0,0),1,8);
                        putText(wim,word,Point(x1,y1),fontface,0.5,CV_RGB(255,0,0), 1, 8);
                        confidence_level+=conf;
                        j++;
                    }
                //}
                delete[] word;
            } while (ri->Next(level));
        }
    }
    //    printf("OCR output:\n%s", outText);
//    printf("num lines: %d \n",numlines);
//    printf("num symbols: %d \n",j);
//    printf("confidence level: %d \n",confidence_level);
    if(numlines>40){
        printf("%d\n",(confidence_level/j));
        imwrite(argv[2],wim);
    }else{
        printf("%d\n",0);
        imwrite(argv[2],wim);
    }
//    namedWindow( "Detected Lines", 1 );
//    imshow( "Detected Lines", color_dst );
//    imshow( "Result", im);
//    imshow( "Wim", wim);
//    imwrite("words.jpg",wim);

//    waitKey();
    // Destroy used object and release memory
    api->End();
    //    delete [] outText;
    pixDestroy(&image);

    return 0;
}

</pre>


----

blockSize: 23

----

