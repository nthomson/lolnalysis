# Let's create a function that downloads a file, and saves it locally.
# This function accepts a file name, a read/write mode(binary or text),
# and the base url.

def stealStuff(file_name,file_mode,base_url):
	from urllib2 import Request, urlopen, URLError, HTTPError
	
	#create the url and the request
	url = base_url + file_name
	req = Request(url)
	
	# Open the url
	try:
		f = urlopen(req)
		print "downloading " + url
		
		# Open our local file for writing
		local_file = open(file_name, "w" + file_mode)
		#Write to our local file
		local_file.write(f.read())
		local_file.close()
		
	#handle errors
	except HTTPError, e:
		print "HTTP Error:",e.code , url
	except URLError, e:
		print "URL Error:",e.reason , url

import csv
reader = csv.reader(open('champions_out.txt', 'r'), delimiter=',')

# Iterate over image range
for champion in reader.next():
	
	base_url = 'http://www.leaguereplays.com/static/images/champions/120/'
	#create file name based on known pattern 
	file_name =  champion.lower() + ".png"
	# Now download the image. If these were text files, 
	# or other ascii types, just pass an empty string 
	# for the second param ala stealStuff(file_name,'',base_url)
	stealStuff(file_name,"b",base_url)
