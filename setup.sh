# UPDATE RASPBERRY

# INSTALL APPS ON RASPBERRY


# CONFIGURE WIFI

# CONFIGURE SCREEN

sudo nano /etc/xdg/lxsession/LXDE-pi/autostart

@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash
chromium-browser --start-fullscreen https://localhost#hMA3x994QvC46YZKnlBnnhZy4QAsQJus


# INSTALL HERBI OS



## SSL Cert generation

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx-selfsigned.key -out ./nginx-selfsigned.crt