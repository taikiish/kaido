#!/bin/bash
# usage: grade.sh in.mp4 out.mp4   (teal/orange dawn grade, crushed blacks, bloom, grain, flash on selected cuts, blur only on whip cuts)
B=0.428571
FL="0.55*gte(t\,2.571)*exp(-(t-2.571)*28)+0.3*gte(t\,4.286)*exp(-(t-4.286)*30)+0.3*gte(t\,7.286)*exp(-(t-7.286)*30)+0.3*gte(t\,10.714)*exp(-(t-10.714)*30)"
ffmpeg -loglevel error -y -i "$1" -filter_complex "
[0:v]format=gbrp,split[a][b];
[b]curves=all='0/0 0.62/0 1/1',gblur=sigma=34[bl];
[a][bl]blend=all_mode=screen:all_opacity=0.55,
curves=all='0/0 0.1/0.03 0.5/0.5 0.9/0.95 1/1',
colorbalance=rs=-0.13:gs=0.03:bs=0.12:rm=-0.03:bm=0.03:rh=0.10:gh=0.02:bh=-0.12,
format=yuv420p,eq=contrast=1.12:saturation=1.15:brightness='$FL':eval=frame,
vignette=PI/5,noise=alls=7:allf=t+u[v]" -map "[v]" -an -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p -movflags +faststart "$2"
