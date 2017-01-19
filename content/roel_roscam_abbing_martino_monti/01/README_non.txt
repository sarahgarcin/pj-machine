net_o_nets.py
-------------

Clicking on any link on the web sets in motion a request for information which travels from node to node, along a variable but predictable route, to reach the server that hosts the desired website. Once the server receives the request, its reply will flow back along roughly the same path to the browser.
This exchange of information travels through just a few of the more than 50,000 different subnetworks that together constitute the Internet. The chosen route is determined by the Internet Service Providers that manage those subnetworks, depending on a series of conditions, including the geographical location of source and destination, the network traffic circumstances and the specific commercial deals between subnetworks - the so-called “peering agreements”.

Accessing any website or service is experienced as qualitatively the same by the browser user, independently of the path that the information packets will take. However, the geographical routes, the providers involved and the infrastructure accessed can vary extremely from case to case.

This text is a README for net_o_nets.py, a post-processor of sorts which searches information about what networks have been traversed in order to reach an external web resource. The resulting metadata is added next to the web-based citations, a process applied to the other texts in this journal. The aim is to include a few of the aforementioned situated aspects of networks, right next to the formal ubiquity and universality of a hyper-link.
Ast the route taken to reach a resource always changes depending on the starting location, the metadata will vary accordingly. The link-analysis for this specific journal has been calculated from the Internet connection of the 25th floor of the Bruxelles World Trade Center, during the Machine Research Workshop hosted by Constant in October 2016.


usage
-----

**Synopsis :**
<pre>
cat original_text_file.txt | python net_o_nets.py > 
annotated_text_file.txt
</pre>

**Example output :**  
  
http://example.com (Proximus NV → RIPE Network Coordination Centre → Telia Company AB → MCI Communications Services, Inc. d/b/a Verizon Business)
