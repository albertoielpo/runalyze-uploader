# Runalyze uploader

Simple node script to upload a local file/dir to runalyze

tcx, gpx and fit files are uploaded

## Install

```
npm i
```

## Usage

```
npm run start [full-path]
```

### Example

```
### single file
npm run start /home/user/doc/activity.fit

### entire directory
npm run start /home/user/doc

### default (use uploads directory)
npm run start
```
