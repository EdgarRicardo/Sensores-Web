#include <16f877a.h>
#device adc=10
#include <stdio.h>
#fuses XT,NOWDT,NOPROTECT,NOLVP,PUT,BROWNOUT
#use DELAY (CLOCK=4MHz)
#use rs232 (baud=9600,parity=N,xmit=pin_c6,rcv=pin_c7,bits=8)

float distancia,tiempo,luz,temperatura;
#define trigger pin_B1
#define echo pin_B0

int Timer2,Postcaler;
//int16 duty;

//Terminar de congif adc
//Leer las entradas en el ADC
   // Voltajes -> Luxes
   // Voltajes -> Temp

void main(){
   setup_timer_1(T1_internal|T1_div_by_1);
   Timer2=249;
   Postcaler=1;
   setup_timer_2(t2_div_by_16,Timer2,Postcaler);
   setup_ccp1(ccp_pwm);
   while(true){
      output_high(trigger);
      delay_us(10);
      output_low(trigger);
      
      while(!input(echo));
      set_timer1(0);
      
      while(input(echo));
      tiempo = get_timer1();
      distancia=(tiempo/2)*(0.0343)*(1.0047); //Sabemos que al medir 100 recibimos 99.53, entonces usamos un factor de escala de 1.0047 para mejorar la medicion
      
      if(distancia>=100){
         set_pwm1_duty(1023);
      }else{
         set_pwm1_duty(0);
      }
      
      
      
      printf("{\"distancia\":%f,\"temperatura\":%f,\"luz\":%f}\n\r",distancia,15.0,30.0);
      //printf("%f\n\r",distancia);
      
      delay_ms(500);
   }
}
